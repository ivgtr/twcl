import Twitter from 'twitter'
import axios from 'axios'
import crypto from 'crypto'
import open from 'open'
import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET_KEY
} from '../configs/config.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const OAuth = require('oauth-1.0a')

const oauthUrl = 'https://api.twitter.com/oauth'
const oauthCallback = 'http://'

const requestData = {
  url: `${oauthUrl}/request_token`,
  method: 'POST',
  data: { oauthCallback }
}
export const Login = async (): Promise<void> => {
  const options = {
    consumer: {
      key: TWITTER_CONSUMER_KEY,
      secret: TWITTER_CONSUMER_SECRET_KEY
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
      return crypto.createHmac('sha1', key).update(baseString).digest('base64')
    }
  }
  const oauth = await OAuth(options)

  const res = await axios.post(
    `${oauthUrl}/request_token`,
    {},
    {
      headers: oauth.toHeader(oauth.authorize(requestData, {}))
    }
  )
  const token = res.data.split('&')[0].split('=')[1]

  await open(`${oauthUrl}/authenticate?oauth_token=${token}&force_login=true`)
}

export const Logout = async () => {
  console.log('やあ')

  await setTimeout(() => {
    console.log('test')
  }, 1000)
}
