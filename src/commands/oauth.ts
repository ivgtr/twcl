import axios from 'axios'
import crypto from 'crypto'
import Datastore from 'nedb'
import open from 'open'
import OAuth, { RequestOptions, Options, Token } from 'oauth-1.0a'
import prompts from 'prompts'
import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET_KEY,
  TWITTER_OAUTH_URL,
  TWITTER_OAUTH_CALLBACK_URL
} from '../configs/config.json'

const oauthUrl = TWITTER_OAUTH_URL
const oauthCallback = TWITTER_OAUTH_CALLBACK_URL
const requestData: RequestOptions = {
  url: `${oauthUrl}/request_token`,
  method: 'POST',
  data: { oauth_verifier: oauthCallback }
}

const inputUser = async (): Promise<boolean> => {
  const { accessToken, accessTokenSecret, userName } = await prompts([
    {
      type: 'text',
      name: 'accessToken',
      message: '公開アクセストークンを入力してください'
    },
    {
      type: 'text',
      name: 'accessTokenSecret',
      message: '秘密アクセストークンを入力してください'
    },
    {
      type: 'text',
      name: 'userName',
      message: '表示名を入力してください'
    }
  ])

  if (accessToken && accessTokenSecret && userName) {
    console.log(`ようこそ、${userName}`)

    try {
      const db = await new Datastore({
        filename: 'configs/setting.db'
      })
      await db.loadDatabase()
      await db.insert(
        {
          user_selected: userName,
          user_list: [
            {
              user_name: userName,
              user_token: accessToken,
              user_token_secret: accessTokenSecret
            }
          ]
        },
        (error, newDoc) => {
          if (error !== null) {
            console.error(error)
          }
          console.log(newDoc)
        }
      )
      return true
    } catch (err) {
      console.log(`${err}\n不明なエラーです`)
      return inputUser()
    }
  }
  return inputUser()
}

export const Login = async (): Promise<void> => {
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
  const getOauthInstance = (): OAuth => {
    return new OAuth(options)
  }

  try {
    const responce = await axios.post(
      `${oauthUrl}/request_token`,
      {},
      {
        headers: getOauthInstance().toHeader(
          getOauthInstance().authorize(requestData)
        )
      }
    )
    const token: Token = responce.data.split('&')[0].split('=')[1]
    await open(`${oauthUrl}/authorize?oauth_token=${token}`)
    if (await inputUser()) {
      console.log('ok')
    } else {
      console.log('error!! もう一度初めからどうぞ')
    }
  } catch (err) {
    console.log(err)
  }
}

export const Logout = async () => {
  console.log('やあ')

  await setTimeout(() => {
    console.log('test')
  }, 1000)
}
