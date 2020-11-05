import axios from 'axios'
import prompts from 'prompts'

import colors from './console'

import { middlewareUrl } from '../configs/configs.json'
import viewTweet from './viewTweet'

const inputQuery = async (): Promise<{
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
        message: '検索ワード: ',
        validate: (value) => (!value ? '何か入力してください' : true)
      }
    ],
    { onCancel }
  )
  return { input }
}

const getSearch = async (
  accessToken: string,
  accessTokenSecret: string,
  q: string,
  num: number
): Promise<void> => {
  try {
    const { data } = await axios.post(`${middlewareUrl}/getSearch`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      q,
      num
    })
    viewTweet(data.reverse())
    return
  } catch (err) {
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const search = async (
  user: userData,
  q: string,
  num: number
): Promise<void> => {
  try {
    const { accessToken, accessTokenSecret } = user
    if (q) {
      await getSearch(accessToken, accessTokenSecret, q, num)
      return
    }
    const { input } = await inputQuery()
    await getSearch(accessToken, accessTokenSecret, input, num)
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default search
