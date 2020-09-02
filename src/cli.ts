import program from 'commander'
import Nedb from 'nedb'
import pjson from 'pjson'
import updateNotifier from 'update-notifier'

import colors from './commands/console'

import { selectedUser } from './commands/db'
import { tweet, timeline, list, user, login, logout } from './commands'

const path = `${__dirname}/configs/database`

const main = async (): Promise<void> => {
  updateNotifier({
    pkg: pjson
  }).notify()

  const db = await new Nedb({
    filename: path
  })
  await db.loadDatabase()

  const loginUser = await selectedUser(db)

  if (!Object.keys(loginUser).length) {
    await login(db)
    return
  }

  program
    .command('login')
    .alias('li')
    .description('ログイン')
    .action(() => login(db))
  program
    .command('logout')
    .alias('lo')
    .description('ログアウト')
    .action(() => logout(db, path))

  program
    .command('user')
    .alias('u')
    .description('ログイン状況の確認')
    .action(() => {
      if (loginUser.name) {
        console.log(
          `${colors.green('✔')} ${loginUser.name} でログインしています`
        )
        return
      }
      console.log('ログインしていません')
    })

  program
    .command('tweet [tweet]')
    .alias('t')
    .description('ツイートする')
    .action((t) => {
      if (typeof t === 'string') {
        tweet(loginUser, t)
        return
      }
      tweet(loginUser, '')
    })

  program
    .command('timeline [user]')
    .alias('tl')
    .description('タイムラインを表示')
    .option('-n, --number <num>', '表示するツイート数を指定(MAX:100)')
    .action((id, options) => {
      const n = options.number ? options.number : 10
      if (typeof id === 'string') {
        if (id.charAt(0) === '@') {
          const userId = id.slice(1)
          timeline(loginUser, userId, n)
          return
        }
        timeline(loginUser, id, n)
        return
      }
      timeline(loginUser, '', n)
    })

  program
    .command('list [listId]')
    .alias('l')
    .description('リストを表示')
    .option('-n, --number <num>', '表示するツイート数を指定(MAX:100)')
    .action((l, options) => {
      const n = options.number ? options.number : 10
      if (typeof l === 'string') {
        list(
          loginUser,
          {
            listid: l
          },
          n
        )
        return
      }
      list(loginUser, {}, n)
    })

  program
    .command('change [user]')
    .alias('c')
    .description('アカウント切替')
    .action((c) => {
      if (typeof c === 'string') {
        user(db, c)
        return
      }
      user(db, '')
    })

  program
    .version(pjson.version, '-v, --version', 'バージョンを確認')
    .helpOption('-h, --help', 'コマンド一覧を表示')
    .parse(process.argv)

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
