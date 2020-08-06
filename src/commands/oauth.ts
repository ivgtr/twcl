import axios from 'axios'
import crypto from 'crypto'
import Datastore from 'nedb'
import open from 'open'
import OAuth, { RequestOptions, Options } from 'oauth-1.0a'
import prompts from 'prompts'

import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET_KEY,
  TWITTER_OAUTH_URL,
  TWITTER_OAUTH_CALLBACK_URL
} from '../configs/config.json'

const options: Options = {
  consumer: {
    key: TWITTER_CONSUMER_KEY,
    secret: TWITTER_CONSUMER_SECRET_KEY
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64')
  }
}

const oauthInstance = (): OAuth => {
  return new OAuth(options)
}

const getOauthToken = async (): Promise<{
  oauthToken?: string
  oauthTokenSecret?: string
}> => {
  const requestData: RequestOptions = {
    url: `${TWITTER_OAUTH_URL}/request_token`,
    method: 'POST',
    data: { oauth_verifier: TWITTER_OAUTH_CALLBACK_URL }
  }

  try {
    const responce = await axios.post(
      `${TWITTER_OAUTH_URL}/request_token`,
      {},
      {
        headers: oauthInstance().toHeader(
          oauthInstance().authorize(requestData)
        )
      }
    )
    const oauthToken: string = responce.data.split('&')[0].split('=')[1]
    const oauthTokenSecret: string = responce.data.split('&')[1].split('=')[1]

    return { oauthToken, oauthTokenSecret }
  } catch (err) {
    console.error(
      'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
    )
    return {}
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
  const requestData: RequestOptions = {
    url: `${TWITTER_OAUTH_URL}/access_token`,
    method: 'POST',
    data: {
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      oauth_verifier: oauthVerifier
    }
  }

  try {
    const responce = await axios.post(
      `${TWITTER_OAUTH_URL}/access_token`,
      {},
      {
        headers: oauthInstance().toHeader(
          oauthInstance().authorize(requestData)
        )
      }
    )
    const accessToken: string = responce.data.split('&')[0].split('=')[1]
    const accessTokenSecret: string = responce.data.split('&')[1].split('=')[1]

    return { accessToken, accessTokenSecret }
  } catch (err) {
    console.error(
      'Error: 入力されたトークンに問題があるようです...もう一度最初から入力してください。'
    )
    return {}
  }
}

const userInput = async (): Promise<{
  oauthVerifier?: string
  userName?: string
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
    return {}
  }
}

const setDb = async (
  accessToken: string,
  accessTokenSecret: string,
  userName: string
) => {
  console.log(accessToken)
  console.log(accessTokenSecret)
  console.log(userName)
}

export const Login = async (): Promise<boolean> => {
  const { oauthToken, oauthTokenSecret } = await getOauthToken()
  if (oauthToken && oauthTokenSecret) {
    await open(`${TWITTER_OAUTH_URL}/authenticate?oauth_token=${oauthToken}`)
  } else {
    return false
  }
  const { oauthVerifier, userName } = await userInput()
  if (oauthVerifier && userName) {
    console.log(`ようこそ、${userName}!`)
  } else {
    return false
  }
  const { accessToken, accessTokenSecret } = await getAccessToken(
    oauthToken,
    oauthTokenSecret,
    oauthVerifier
  )
  if (accessToken && accessTokenSecret) {
    await setDb(accessToken, accessTokenSecret, userName)
  } else {
    return false
  }
  return true
}

export const Logout = (): boolean => {
  console.log('logout')
  return true
}
