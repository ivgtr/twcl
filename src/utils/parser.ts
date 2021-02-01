import chalk from 'chalk'

import {
  operationUserChange,
  operationUserLogin,
  operationUserLogout,
  postTweet,
  showTweetList,
  showTweetSerch,
  showTweetTimeline,
  showTweetUser
} from './commands'
import { database } from './db'
import error from './error'

const db = new database()

export const operationUser = async (options: {
  add?: boolean
  delete?: boolean
  change?: boolean
}) => {
  const user = await db.init()
  if (!user) {
    console.log(`${chalk.red('Not found Account, Register a new User')}`)
    operationUserLogin(db).catch(error)
  } else if (options.add && !options.delete && !options.change) {
    operationUserLogin(db).catch(error)
  } else if (!options.add && options.delete && !options.change) {
    operationUserLogout(db).catch(error)
  } else if (!options.add && !options.delete && options.change) {
    operationUserChange(db).catch(error)
  } else {
    console.log(`${chalk.green('✔')} Login as ${user.user_name}`)
  }
}
export const tweet = (options: { tweet?: string; filepath?: string }) => {
  postTweet(options.tweet, options.filepath).catch(error)
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
