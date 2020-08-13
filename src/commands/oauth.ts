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
  accessToken: string
  accessTokenSecret: string
  id: number
}> => {
  try {
    const request = await axios.post(`${middlewareUrl}/getAccessToken`, {
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      oauth_verifier: oauthVerifier
    })
    const { accessToken, accessTokenSecret, id } = request.data
    return { accessToken, accessTokenSecret, id }
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

const unSelectDb = async (db: Nedb) => {
  const data: boolean = await new Promise((resolve) => {
    db.update(
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
          resolve(true)
          return
        }
        throw new Error(
          'database登録時にエラーがあったようです...もう一度ログインを試してみてください'
        )
      }
    )
  })
  await db.loadDatabase()
  return data
}

const setDb = async (
  db: Nedb,
  accessToken: string,
  accessTokenSecret: string,
  userName: string,
  id: number
) => {
  try {
    const preSet = await unSelectDb(db)
    if (preSet) {
      const data = {
        type: 'user',
        name: userName,
        accessToken,
        accessTokenSecret,
        userid: id.toString(),
        selected: true
      }
      db.insert(data, (err) => {
        if (!err) {
          console.log(`ようこそ、${userName}!`)
          return
        }
        throw new Error(
          'database登録時にエラーがあったようです...もう一度ログインを試してみてください'
        )
      })
    }
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
    const { accessToken, accessTokenSecret, id } = await getAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    )
    if (accessToken && accessTokenSecret && id) {
      await setDb(db, accessToken, accessTokenSecret, userName, id)
    } else {
      return
    }
  } catch (e) {
    console.error(e.message)
  }
}

const deleteUser = async (db: Nedb, id: string, name: string) => {
  const flag: boolean = await new Promise((resolve) => {
    db.remove({ _id: id }, { multi: false }, (err) => {
      if (!err) {
        console.log(`Success: ${name}からログアウトしました`)
        resolve(true)
        return
      }
      throw new Error(
        'database操作時にエラーがあったようです...もう一度ログインを試してみてください'
      )
    })
  })
  return flag
}

const findUsers = async (
  db: Nedb
): Promise<
  { title: string; value: { type: string; id?: string; name?: string } }[]
> => {
  try {
    const selectedUser: {
      title: string
      value: { type: string; id?: string; name?: string }
    }[] = await new Promise((resolve) => {
      db.find({}, (err, result) => {
        if (!err) {
          const selectArray: {
            title: string
            value: { type: string; id?: string; name?: string }
          }[] = [
            {
              title: 'all',
              value: { type: 'all' }
            }
          ]
          for (let i = 0; i < result.length; i += 1) {
            selectArray.push({
              title: result[i].name,
              value: {
                type: 'user',
                id: result[i]._id,
                name: result[i].name
              }
            })
          }
          resolve(selectArray)
          return
        }
        throw new Error(
          'database検索時にエラーがあったようです...もう一度試してみてください'
        )
      })
    })
    return selectedUser
  } catch (err) {
    throw new Error(
      'Error: パッケージに何か問題があるようです...databaseを削除すると直るかもしれません'
    )
  }
}

const checkSelectUser = async (db: Nedb): Promise<boolean> => {
  try {
    const check: boolean = await new Promise((resolve) => {
      db.find({ selected: true }, (err, result) => {
        if (!err) {
          if (result.length) {
            resolve(true)
            return
          }
          resolve(false)
          return
        }
        throw new Error(
          'database検索時にエラーがあったようです...もう一度試してみてください'
        )
      })
    })
    return check
  } catch (err) {
    throw new Error(
      'database検索時にエラーがあったようです...もう一度試してみてください'
    )
  }
}

const selectUser = async (db: Nedb) => {
  const user: string = await new Promise((resolve) => {
    db.findOne({}, (err, selected) => {
      if (!err) {
        if (selected) {
          const { _id } = selected
          resolve(_id)
          return
        }
        resolve('')
        return
      }
      throw new Error(
        'database検索時にエラーがあったようです...もう一度試してみてください'
      )
    })
  })
  return user
}

const updateUser = async (db: Nedb, user: string) => {
  const completed = await new Promise((resolve) => {
    db.update(
      { _id: user },
      {
        $set: {
          selected: true
        }
      },
      {},
      (err) => {
        if (!err) {
          resolve(true)
          return
        }
        throw new Error(
          'database検索時にエラーがあったようです...もう一度試してみてください'
        )
      }
    )
  })
  return completed
}

const logoutUser = async (
  db: Nedb,
  id: string,
  name: string
): Promise<boolean> => {
  try {
    await deleteUser(db, id, name)
    const check = await checkSelectUser(db)
    if (!check) {
      const user = await selectUser(db)
      if (user) {
        await updateUser(db, user)
      }
    }
    await db.loadDatabase()
    return true
  } catch (err) {
    throw new Error(err.message)
  }
}

const selectedDeleteUser = async (
  selected: {
    title: string
    value: { type: string; id?: string; name?: string }
  }[]
): Promise<{ type: string; id?: string; name?: string }> => {
  try {
    const onCancel = () => {
      console.error('Error: 選択されませんでした')
    }
    const { user } = await prompts(
      [
        {
          type: 'select',
          name: 'user',
          message: '削除したいアカウントを選択してください',
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

export const Logout = async (db: Nedb, path: string): Promise<void> => {
  try {
    const selectedArray = await findUsers(db)
    const { type, id, name } = await selectedDeleteUser(selectedArray)
    if (type === 'all') {
      fs.unlinkSync(path)
      console.log('Success: 全てのアカウントからログアウトしました')
      return
    }
    if (type) {
      if (await logoutUser(db, id, name)) {
        return
      }
    }
    return
  } catch (err) {
    db.loadDatabase()
    console.error(err.message)
  }
}
