import axios from 'axios'
import open from 'open'
import prompts from 'prompts'
import ora from 'ora'
import { database } from '../db'
import config from '../../configs/config.json'

const proxyUrl = config.url.proxy
const oauthUrl = config.url.oauth

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
      id: string
    }>((response) => response.data)
}

const userInput = async (db: database) => {
  const onCancel = () => {
    throw new Error('Could not confirm your input, Try again')
  }
  return prompts(
    [
      {
        type: 'text',
        name: 'oauthVerifier',
        message: 'Please enter the PIN code displayed in Browser',
        validate: (value: string) => (!value ? 'Please enter.' : true)
      },
      {
        type: 'text',
        name: 'userName',
        message: 'Please enter a display name',
        validate: async (value: string) => {
          if (!value) {
            return 'Please enter.'
          } else if (await db.searchUser(value)) {
            return 'Already in use, Please enter once more'
          } else {
            return true
          }
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
  const spinner = ora('Loading...').start()
  const { oauthToken, oauthTokenSecret } = await getRequestToken().catch((err) => {
    spinner.stop()
    throw err
  })
  spinner.succeed('All set!')
  await open(`${oauthUrl}/authenticate?oauth_token=${oauthToken}`)
  const { oauthVerifier, userName } = await userInput(db)
  const _spinner = ora('Loading...').start()
  const { accessToken, accessTokenSecret, id } = await getAccessToken(
    oauthToken,
    oauthTokenSecret,
    oauthVerifier
  ).catch((err) => {
    _spinner.stop()
    throw err
  })
  await db
    .unSetUser()
    .then(() => {
      db.setUser({
        user_name: userName,
        user_id: id,
        access_token: accessToken,
        access_token_secret: accessTokenSecret,
        selected: true
      })
    })
    .catch((err) => {
      _spinner.stop()
      throw new Error(err)
    })
  _spinner.succeed(`Login as ${userName}`)
}
