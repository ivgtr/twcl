import axios from 'axios'
import Nedb from 'nedb'
import prompts from 'prompts'

type Token = {
  type?: string
  name?: string
  accessToken: string
  accessTokenSecret: string
  selected?: boolean
}

const middlewareUrl = 'https://twcl-middleware.herokuapp.com'

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
    return { input: '' }
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
    return false
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
          console.log('Success: 送信完了')
          return true
        }
        console.log('Error: トホホ...送信に失敗しちゃったようですね')
        return false
      }
      console.log('Error: アカウントが見つからないようです...')
      return false
    }
  )
}

const Tweet = async (db: Nedb, tweet?: string): Promise<boolean> => {
  if (tweet) {
    if (await checkUser(db, tweet)) {
      return true
    }
    return false
  }
  const { input } = await inputTweet()
  if (input) {
    if (await checkUser(db, input)) {
      return true
    }
    return false
  }
  console.log('Error: 不明なエラー')
  return false
}

export default Tweet
