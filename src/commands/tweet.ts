import axios from 'axios'
import Nedb from 'nedb'
import prompts from 'prompts'

import { middlewareUrl } from '../configs/configs.json'

type Token = {
  type?: string
  name?: string
  accessToken: string
  accessTokenSecret: string
  selected?: boolean
}

const inputTweet = async (): Promise<{
  input: string
}> => {
  try {
    const onCancel = () => {
      console.error(
        'Error: 入力内容が確認できませんでした...もう一度最初から入力してください。'
      )
    }
    const { input }: { input: string } = await prompts(
      [
        {
          type: 'text',
          name: 'input',
          message: 'ツイート: ',
          validate: (value) => (!value ? '何か入力してください' : true)
        }
      ],
      { onCancel }
    )
    return { input }
  } catch (err) {
    throw new Error(
      '入力内容が確認できませんでした...もう一度最初から入力してください。'
    )
  }
}

const postTweet = async (
  accessToken: string,
  accessTokenSecret: string,
  tweet: string
) => {
  try {
    const res = await axios.post(`${middlewareUrl}/postTweet`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      tweet
    })
    console.log(res.data)
    return true
  } catch (err) {
    throw new Error(
      'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
    )
  }
}

const checkUser = (db: Nedb, tweet: string): any => {
  return db.find(
    {}, // 最新の登録ユーザーを使うように一旦設定
    // { selected: true },
    async (err, result: Token[]): Promise<boolean> => {
      if (!err) {
        const { accessToken, accessTokenSecret } = result.slice(-1)[0] // 変更
        if (await postTweet(accessToken, accessTokenSecret, tweet)) {
          console.log(`Success: 送信完了\nツイート: ${tweet}`)
          return true
        }
        throw new Error(
          'トホホ...送信に失敗しちゃったようです...もう一度ログインを試してみてください'
        )
      }
      throw new Error(
        'アカウントが見つからないようです...もう一度ログインを試してみてください'
      )
    }
  )
}

const Tweet = async (db: Nedb, tweet?: string): Promise<boolean> => {
  if (tweet) {
    if (await checkUser(db, tweet)) {
      return true
    }
    throw new Error(
      'アカウントが見つからないようです...ログインを試してみてください'
    )
  }
  const { input } = await inputTweet()
  if (input) {
    if (await checkUser(db, input)) {
      return true
    }
    throw new Error(
      'アカウントが見つからないようです...ログインを試してみてください'
    )
  }
  throw new Error('不明なエラー')
}

export default Tweet
