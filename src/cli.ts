import program from 'commander'
import Datastore from 'nedb'

import tweet from './commands/tweet'
import { Login } from './commands/oauth'

const main = (): void => {
  const db = new Datastore({
    filename: 'configs/setting.db'
  })
  db.loadDatabase()

  if (!db) {
    Login()
    return
  }

  program
    .option('-l, --login', 'ログインする')
    .option('-lo, --logout', 'ログアウトする')
    .option('-t, --tweet [tweet]', 'ツイートする')
    .option('-tl, --timeline', 'タイムラインを取得します')
    .parse(process.argv)

  if (program.tweet) tweet()
  if (program.login) Login()
  // For default, show help
  const NO_COMMAND_SPECIFIED = process.argv.length <= 2
  if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help()
  }
}

export default main
