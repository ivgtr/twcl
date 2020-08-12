import axios from 'axios'
import Nedb from 'nedb'
import open from 'open'
import prompts from 'prompts'

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
    throw new Error(
      'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
    )
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
    throw new Error(
      '入力されたトークンに問題があるようです・・・もう一度最初から試してみてください。'
    )
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
    throw new Error(
      '入力内容が確認できませんでした...もう一度最初から入力してください。'
    )
  }
}

const setDb = async (
  db: Nedb,
  accessToken: string,
  accessTokenSecret: string,
  userName: string
) => {
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
}

export const Login = async (db: Nedb): Promise<boolean> => {
  const { oauthToken, oauthTokenSecret } = await getOauthToken()
  if (oauthToken && oauthTokenSecret) {
    await open(`${callbackUrl}/authenticate?oauth_token=${oauthToken}`)
  } else {
    throw new Error(
      'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
    )
  }
  const { oauthVerifier, userName } = await userInput()
  if (!oauthVerifier || !userName) {
    throw new Error(
      '入力内容が確認できませんでした...もう一度最初から入力してください。'
    )
  }
  const { accessToken, accessTokenSecret } = await getAccessToken(
    oauthToken,
    oauthTokenSecret,
    oauthVerifier
  )
  if (accessToken && accessTokenSecret) {
    await setDb(db, accessToken, accessTokenSecret, userName)
  } else {
    throw new Error(
      '入力されたトークンに問題があるようです・・・もう一度最初から試してみてください。'
    )
  }
  return true
}

export const Logout = (): boolean => {
  console.log('logout')
  return true
}
