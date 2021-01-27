import axios from 'axios'
import open from 'open'
import prompts from 'prompts'
import ora from 'ora'
import { database } from '../db'

const proxyUrl = 'http://localhost:3000/api'
const oauthUrl = 'https://api.twitter.com/oauth'

const getAccessToken = async (
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
) => {
  return axios
    .post(`${proxyUrl}/get_access_token`, {
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    })
    .then<{
      accessToken: string
      accessTokenSecret: string
    }>((response) => response.data)
}

const userInput = async (db: database) => {
  const onCancel = () => {
    throw new Error('入力内容が確認できませんでした...もう一度最初から入力してください。')
  }
  return prompts(
    [
      {
        type: 'text',
        name: 'oauthVerifier',
        message: 'ブラウザに表示されたトークンを入力してください',
        validate: (value: string) => (!value ? '何か入力してください' : true)
      },
      {
        type: 'text',
        name: 'userName',
        message: '表示名を入力してください',
        validate: async (value: string) => {
          if (!value) {
            return '何か入力してください'
          }
          if (await db.searchUser(value)) {
            return 'すでにその名前は使われています、他の名前を入力してください'
          }
          return true
        }
      }
    ],
    { onCancel }
  ).then<{ oauthVerifier: string; userName: string }>((input) => input)
}

const getRequestToken = () => {
  return axios
    .post(`${proxyUrl}/get_request_token`)
    .then<{ oauthToken: string; oauthTokenSecret: string }>((response) => response.data)
}

export const operationUserLogin = async (db: database) => {
  const spinner = ora('wait...').start()
  const { oauthToken, oauthTokenSecret } = await getRequestToken()
  spinner.succeed('準備完了!')
  if (!oauthToken && !oauthTokenSecret)
    throw new Error('Twitter APIに問題があるようです。時間開けてもう一度お試しください')
  await open(`${oauthUrl}/authenticate?oauth_token=${oauthToken}`)
  const { oauthVerifier, userName } = await userInput(db)
  const { accessToken, accessTokenSecret } = await getAccessToken(
    oauthToken,
    oauthTokenSecret,
    oauthVerifier
  )
  await db.setUser({
    user_name: userName,
    user_id: 'userId',
    access_token: accessToken,
    access_token_secret: accessTokenSecret,
    selected: true
  })
}
