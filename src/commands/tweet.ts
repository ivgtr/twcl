import axios from 'axios'
import prompts from 'prompts'

import { middlewareUrl } from '../configs/configs.json'

type user = {
  type?: string
  name?: string
  accessToken?: string
  accessTokenSecret?: string
  userid?: string
  selected?: boolean
  _id?: string
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
    await axios.post(`${middlewareUrl}/postTweet`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      tweet
    })
    return true
  } catch (err) {
    throw new Error(
      'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
    )
  }
}

const Tweet = async (user: user, tweet?: string): Promise<void> => {
  try {
    if (tweet) {
      const { accessToken, accessTokenSecret } = user
      if (await postTweet(accessToken, accessTokenSecret, tweet)) {
        console.log(`Success: 送信完了\nツイート: ${tweet}`)
        return
      }
      throw new Error('ツイートの送信にエラーがあったようです...')
    }
    const { input } = await inputTweet()
    if (input) {
      const { accessToken, accessTokenSecret } = user
      if (await postTweet(accessToken, accessTokenSecret, input)) {
        console.log(`Success: 送信完了\nツイート: ${input}`)
        return
      }
      throw new Error('ツイートの送信にエラーがあったようです...')
    }
  } catch (err) {
    console.error(err.message)
  }
}

export default Tweet
