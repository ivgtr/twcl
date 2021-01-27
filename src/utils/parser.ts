import chalk from 'chalk'

import {
  operationUserChange,
  operationUserLogin,
  operationUserLogout,
  submitTweet,
  showTweetList,
  showTweetSerch,
  showTweetTimeline,
  showTweetUser
} from './commands'
import { database } from './db'

const db = new database()

export const operationUser = async (options: {
  add?: boolean
  delete?: boolean
  change?: boolean
}) => {
  const user = await db.init()
  if (!user) {
    console.log('ユーザーを追加')
    operationUserLogin(db).catch((err) => {
      console.log(err)
    })
  } else if (options.add && !options.delete && !options.change) {
    console.log('ユーザーを追加')
    operationUserLogin(db)
  } else if (!options.add && options.delete && !options.change) {
    console.log('ユーザーを削除')
    operationUserLogout(db)
  } else if (!options.add && !options.delete && options.change) {
    console.log('ユーザーを変更')
    operationUserChange()
  } else {
    console.log(`${chalk.green('✔')} ${user.user_name} でログインしています`)
  }
}
export const tweet = (options: { tweet?: string; image?: string }): void => {
  if (options.tweet?.length) {
    console.log('そのまま送信')
    return
  }
  console.log('入力を表示')
  submitTweet()
}
export const showTweet = (options: {
  timeline?: boolean
  list?: boolean
  user?: string
  search: string
  count: number
}) => {
  if (options.timeline && !options.list && !options.user && !options.search) {
    console.log('タイムライン表示')
    showTweetTimeline()
  } else if (!options.timeline && options.list && !options.user && !options.search) {
    console.log('リスト表示')
    showTweetList()
  } else if (!options.timeline && !options.list && options.user && !options.search) {
    console.log('ユーザー情報表示')
    showTweetUser()
  } else if (!options.timeline && !options.list && !options.user && options.search) {
    console.log('検索')
    showTweetSerch()
  } else {
    console.log('お前は何がしたい')
  }
}
