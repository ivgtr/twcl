import axios from 'axios'
import Nedb from 'nedb'
import open from 'open'
import prompts from 'prompts'
import fs from 'fs'

import { middlewareUrl, callbackUrl } from '../configs/configs.json'

const getOauthToken = async (): Promise<{
  oauthToken: string
  oauthTokenSecret: string
}> => {
  try {
    const request = await axios.post(`${middlewareUrl}/getOauthToken`)
    const { oauthToken, oauthTokenSecret } = request.data
    return { oauthToken, oauthTokenSecret }
  } catch (err) {
    throw new Error(err.message)
  }
}

const getAccessToken = async (
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
): Promise<{
  accessToken?: string
  accessTokenSecret?: string
}> => {
  try {
    const request = await axios.post(`${middlewareUrl}/getAccessToken`, {
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      oauth_verifier: oauthVerifier
    })
    const { accessToken, accessTokenSecret } = request.data
    return { accessToken, accessTokenSecret }
  } catch (err) {
    throw new Error(err.message)
  }
}

const userInput = async (): Promise<{
  oauthVerifier: string
  userName: string
}> => {
  try {
    const onCancel = () => {
      console.error(
        'Error: 入力内容が確認できませんでした...もう一度最初から入力してください。'
      )
    }
    const {
      oauthVerifier,
      userName
    }: { oauthVerifier: string; userName: string } = await prompts(
      [
        {
          type: 'text',
          name: 'oauthVerifier',
          message: 'ブラウザに表示されたトークンを入力してください',
          validate: (value) => (!value ? '何か入力してください' : true)
        },
        {
          type: 'text',
          name: 'userName',
          message: '表示名を入力してください',
          validate: (value) => (!value ? '何か入力してください' : true)
        }
      ],
      { onCancel }
    )
    return { oauthVerifier, userName }
  } catch (err) {
    throw new Error(err.message)
  }
}

const setDb = async (
  db: Nedb,
  accessToken: string,
  accessTokenSecret: string,
  userName: string
) => {
  try {
    await db.update(
      {
        selected: true
      },
      {
        $set: {
          selected: false
        }
      },
      {
        multi: true
      },
      (error) => {
        if (!error) {
          const data = {
            type: 'user',
            name: userName,
            accessToken,
            accessTokenSecret,
            selected: true
          }

          db.insert(data, () => {
            console.log(`ようこそ、${userName}!`)
          })
        } else {
          throw new Error(
            'database登録時にエラーがあったようです...もう一度ログインを試してみてください'
          )
        }
      }
    )
  } catch (err) {
    throw new Error(err.message)
  }
}

export const Login = async (db: Nedb): Promise<void> => {
  try {
    const { oauthToken, oauthTokenSecret } = await getOauthToken()
    if (oauthToken && oauthTokenSecret) {
      await open(`${callbackUrl}/authenticate?oauth_token=${oauthToken}`)
    } else {
      return
    }
    const { oauthVerifier, userName } = await userInput()
    if (!oauthVerifier || !userName) {
      return
    }
    const { accessToken, accessTokenSecret } = await getAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    )
    if (accessToken && accessTokenSecret) {
      await setDb(db, accessToken, accessTokenSecret, userName)
    } else {
      return
    }
  } catch (e) {
    console.error(e.message)
  }
}

const logoutUser = async (
  db: Nedb,
  user: string,
  path: string
): Promise<boolean> => {
  try {
    await new Promise(() => {
      db.find({ _id: user }, (err, result) => {
        console.log(result)
        db.remove({ _id: user }, { multi: false }, (e) => {
          if (!e) {
            console.log(
              `Success: ${result.slice(-1)[0].name}からログアウトしました`
            )
          }
        })
        if (result.slice(-1)[0].selected) {
          db.find({ selected: false }, (errr, selected) => {
            db.update(
              { _id: selected.slice(-1)[0]._id },
              {
                $set: {
                  selected: true
                }
              },
              {},
              () => {
                const reload = new Nedb({
                  filename: path
                })
                reload.loadDatabase()
              }
            )
          })
        }
      })
    })
    return true
  } catch (err) {
    throw new Error('Error: 不明なエラー')
  }
}

const selectedDeleteUser = async (
  selected: { title: string; value: string }[]
): Promise<string> => {
  try {
    const onCancel = () => {
      console.error('Error: 選択されませんでした')
    }
    const { user } = await prompts(
      [
        {
          type: 'select',
          name: 'user',
          message: '削除したいアカウントを洗濯してください',
          choices: selected
        }
      ],
      { onCancel }
    )
    return user
  } catch (err) {
    throw new Error('Error: 選択されませんでした')
  }
}

const findUsers = async (
  db: Nedb
): Promise<{ title: string; value: string }[]> => {
  try {
    const selectedUser: { title: string; value: string }[] = await new Promise(
      (resolve) => {
        db.find({}, (err, result) => {
          const selectArray = [
            {
              title: 'all',
              value: 'all'
            }
          ]
          for (let i = 0; i < result.length; i += 1) {
            selectArray.push({
              title: result[i].name,
              value: result[i]._id
            })
          }
          resolve(selectArray)
        })
      }
    )
    return selectedUser
  } catch (err) {
    throw new Error(
      'Error: パッケージに何か問題があるようです...databaseを削除すると直るかもしれません'
    )
  }
}

export const Logout = async (db: Nedb, path: string): Promise<void> => {
  try {
    const selectedArray = await findUsers(db)
    const user = await selectedDeleteUser(selectedArray)
    if (user === 'all') {
      fs.unlinkSync(path)
      console.log('Success: 全てのアカウントからログアウトしました')
      return
    }
    if (user) {
      if (await logoutUser(db, user, path)) {
        return
      }
    }
    return
  } catch (err) {
    console.error(err.message)
  }
}
