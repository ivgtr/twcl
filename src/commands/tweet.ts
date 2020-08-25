import axios from 'axios'
import prompts from 'prompts'

import colors from './console'

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
  const onCancel = () => {
    throw new Error(
      '入力内容が確認できませんでした...もう一度最初から入力してください。'
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
    throw new Error(err.message)
  }
}

const Tweet = async (user: user, tweet?: string): Promise<void> => {
  try {
    const { accessToken, accessTokenSecret } = user
    if (tweet) {
      if (await postTweet(accessToken, accessTokenSecret, tweet)) {
        console.log(`${colors.green('✔')} 送信完了\nツイート: ${tweet}`)
      }
      return
    }
    const { input } = await inputTweet()
    if (await postTweet(accessToken, accessTokenSecret, input)) {
      console.log(`${colors.green('✔')} 送信完了\nツイート: ${input}`)
    }
    return
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default Tweet
