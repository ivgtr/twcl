import axios from 'axios'
import prompts from 'prompts'

import colors from './console'

import { middlewareUrl } from '../configs/configs.json'
import viewTweet from './viewTweet'

const getLists = async (
  accessToken: string,
  accessTokenSecret: string,
  userid: string
): Promise<listData[]> => {
  try {
    const { data } = await axios.post(`${middlewareUrl}/getList`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      options: {
        userid
      }
    })

    return data
  } catch (err) {
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const selectedList = async (lists: listData[]) => {
  const selected = []
  await lists.forEach((list: listData) => {
    const shap = {
      title: `${list.name} ${list.description}`,
      value: list.id
    }
    selected.push(shap)
  })
  const onCancel = () => {
    throw new Error('選択されませんでした')
  }
  const { selectedListId } = await prompts(
    [
      {
        type: 'select',
        name: 'selectedListId',
        message: '取得したいリストを選択してください',
        choices: selected
      }
    ],
    { onCancel }
  )
  return selectedListId
}

const getList = async (
  accessToken,
  accessTokenSecret,
  options: {
    listid?: string
  },
  num: number
): Promise<void> => {
  try {
    const { data } = await axios.post(`${middlewareUrl}/getList`, {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      options,
      num
    })
    viewTweet(data.reverse())
    return
  } catch (err) {
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const list = async (
  user: userData,
  data: {
    listid?: string
  },
  num: number
): Promise<void> => {
  try {
    const { accessToken, accessTokenSecret, userid } = user
    if (Object.keys(data).length) {
      const { listid } = data
      await getList(
        accessToken,
        accessTokenSecret,
        {
          listid
        },
        num
      )
      return
    }
    const lists: listData[] = await getLists(
      accessToken,
      accessTokenSecret,
      userid
    )
    const selectedListId: string = await selectedList(lists)
    await getList(
      accessToken,
      accessTokenSecret,
      {
        listid: selectedListId
      },
      num
    )
    return
  } catch (err) {
    console.error(`${colors.red('✖')} ${err.message}`)
  }
}

export default list
