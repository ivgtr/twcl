import axios from 'axios'
import Nedb from 'nedb'
import colors from './console'

// import { middlewareUrl } from '../configs/configs.json'
const middlewareUrl = 'http://localhost:5000'

type Token = {
  type?: string
  name?: string
  accessToken: string
  accessTokenSecret: string
  selected?: boolean
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

const list = async (
  db: Nedb,
  data: {
    userName?: string
    listName?: string
  }
): Promise<void> => {
  try {
    const { accessToken, accessTokenSecret } = await checkUser(db)
    if (Object.keys(data).length) {
      const { userName, listName } = data
      console.log('true', data)
      return
    }
    console.log('false', data)
  } catch (err) {
    console.error(err.message)
  }
}

export default list
