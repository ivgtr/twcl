import axios from 'axios'
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
  userId: string,
  num: number
) => {
  try {
    const { data } = await axios.post(`${middlewareUrl}/getTimeline`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      user: userId,
      num
    })
    await viewTimeline(data)
    return true
  } catch (err) {
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const timeline = async (
  user: user,
  userId: string,
  num: number
): Promise<void> => {
  try {
    const { accessToken, accessTokenSecret } = user
    await getTimeline(accessToken, accessTokenSecret, userId, num)
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default timeline
