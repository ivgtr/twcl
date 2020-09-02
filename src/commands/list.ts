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

type list = { id: string; name: string; description: string }

const viewListTimeline = (
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

const getLists = async (
  accessToken: string,
  accessTokenSecret: string,
  userid: string
): Promise<list[]> => {
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

const selectedList = async (lists: list[]) => {
  const selected = []
  await lists.forEach((list: list) => {
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
    await viewListTimeline(data)
    return
  } catch (err) {
    if (err.response.data.msg) throw new Error(err.response.data.msg)

    throw new Error(err.message)
  }
}

const list = async (
  user: user,
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
    const lists: list[] = await getLists(accessToken, accessTokenSecret, userid)
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
