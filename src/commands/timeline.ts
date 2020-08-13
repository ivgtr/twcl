import axios from 'axios'
import Nedb from 'nedb'
import colors from './console'

import { middlewareUrl } from '../configs/configs.json'
// const middlewareUrl = 'http://localhost:5000'

type Token = {
  type?: string
  name?: string
  accessToken: string
  accessTokenSecret: string
  selected?: boolean
}

const viewTimeline = (
  data: {
    id: string
    name: string
    text: string
  }[]
) => {
  data.forEach((item) => {
    console.log(`${item.name} ${colors.blue(item.id)}\n${item.text}\n`)
  })
}

const getTimeline = async (
  accessToken: string,
  accessTokenSecret: string,
  user: string
) => {
  try {
    const { data } = await axios.post(`${middlewareUrl}/getTimeline`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      user
    })
    await viewTimeline(data)
    return true
  } catch (err) {
    throw new Error(
      'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
    )
  }
}

const checkUser = async (
  db: Nedb
): Promise<{
  accessToken?: string
  accessTokenSecret?: string
}> => {
  const Token = await new Promise((resolve) => {
    db.find(
      { selected: true },
      async (err, result: Token[]): Promise<boolean> => {
        if (!err) {
          const { accessToken, accessTokenSecret } = result.slice(-1)[0] // 変更
          if (accessToken && accessTokenSecret) {
            resolve({ accessToken, accessTokenSecret })
          }
          return
        }
        throw new Error(
          'アカウントが見つからないようです...もう一度ログインを試してみてください'
        )
      }
    )
  })
  return Token
}

export const list = () => {
  console.log('a')
}

export const timeline = async (db: Nedb, user: string): Promise<void> => {
  try {
    const { accessToken, accessTokenSecret } = await checkUser(db)
    if (await getTimeline(accessToken, accessTokenSecret, user)) {
      return
    }
  } catch (err) {
    console.error(err.message)
  }
}
