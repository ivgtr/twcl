import program from 'commander'
import Nedb from 'nedb'
import pjson from 'pjson'

import colors from './commands/console'

import { selectedUser } from './commands/db'
import { tweet, timeline, list, user, login, logout } from './commands'

const path = `${__dirname}/configs/database`

const main = async (): Promise<void> => {
  const db = await new Nedb({
    filename: path
  })
  await db.loadDatabase()

  const loginUser = await selectedUser(db)

  program
    .version(pjson.version, '-v, --version', 'バージョンを確認')
    .option('-l, --login', 'ログイン')
    .option('-lo, --logout', 'ログアウト')
    .option('-t, --tweet [tweet]', 'ツイート')
    .option('-tl, --timeline [user]', 'タイムラインを取得')
    .option('-li, --list [user/list]', 'リストを取得')
    .option('-c, --change [user]', 'アカウント切替')
    .parse(process.argv)

  if (!Object.keys(loginUser).length) {
    await login(db)
    return
  }

  if (program.login) login(db)
  if (program.logout) logout(db, path)
  if (program.tweet) {
    if (typeof program.tweet === 'string') {
      tweet(loginUser, program.tweet)
      return
    }
    tweet(loginUser, '')
    return
  }
  if (program.timeline) {
    if (typeof program.timeline === 'string') {
      if (program.timeline.charAt(0) === '@') {
        const userId = program.timeline.slice(1)
        timeline(loginUser, userId)
        return
      }
      timeline(loginUser, program.timeline)
      return
    }
    timeline(loginUser, '')
    return
  }
  if (program.list) {
    if (typeof program.list === 'string') {
      list(loginUser, {
        listid: program.list
      })
      return
    }
    list(loginUser, {})
    return
  }
  if (program.change) {
    if (typeof program.change === 'string') {
      user(db, program.change)
      return
    }
    user(db, '')
    return
  }
  // For default, show help
  const NO_COMMAND_SPECIFIED = process.argv.length <= 2
  if (NO_COMMAND_SPECIFIED) {
    if (loginUser.name) {
      console.log(`${colors.green('✔')} ${loginUser.name} でログインしています`)
      return
    }
    console.log('ログインしていません')
  }
}

export default main
