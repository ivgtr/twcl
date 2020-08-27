import axios from 'axios'
import Nedb from 'nedb'
import open from 'open'
import prompts from 'prompts'
import ora from 'ora'
import colors from './console'

import { setUser, unSetSelecte, checkUserName } from './db'

import { middlewareUrl, callbackUrl } from '../configs/configs.json'

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
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const userInput = async (
  db: Nedb
): Promise<{
  oauthVerifier: string
  userName: string
}> => {
  const onCancel = () => {
    throw new Error(
      '入力内容が確認できませんでした...もう一度最初から入力してください。'
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
        validate: async (value) => {
          if (!value) {
            return '何か入力してください'
          }
          if (await checkUserName(db, value)) {
            return 'すでにその名前は使われています、他の名前を入力してください'
          }
          return true
        }
      }
    ],
    { onCancel }
  )
  return { oauthVerifier, userName }
}

const getOauthToken = async (): Promise<{
  oauthToken: string
  oauthTokenSecret: string
}> => {
  try {
    const request = await axios.post(`${middlewareUrl}/getOauthToken`)
    const { oauthToken, oauthTokenSecret } = request.data
    return { oauthToken, oauthTokenSecret }
  } catch (err) {
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const Login = async (db: Nedb): Promise<void> => {
  try {
    const spinner = ora('通信中...').start()
    const { oauthToken, oauthTokenSecret } = await getOauthToken()
    spinner.succeed('準備完了!')
    if (oauthToken && oauthTokenSecret) {
      await open(`${callbackUrl}/authenticate?oauth_token=${oauthToken}`)
    } else {
      throw new Error(
        'Twitter APIに問題があるようです。時間開けてもう一度お試しください'
      )
    }
    const { oauthVerifier, userName } = await userInput(db)
    const { accessToken, accessTokenSecret, id } = await getAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    )
    if (accessToken && accessTokenSecret && id) {
      if (await unSetSelecte(db)) {
        if (await setUser(db, accessToken, accessTokenSecret, userName, id)) {
          console.log(`${colors.green('✔')} ようこそ、${userName}!`)
          return
        }
      }
      throw new Error('databaseに問題があります')
    } else {
      throw new Error('入力されたTokenに問題があります')
    }
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default Login
