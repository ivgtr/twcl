import program from 'commander'
import Nedb from 'nedb'

import tweet from './commands/tweet'
import { Login } from './commands/oauth'

const userCheck = (db): boolean => {
  return db.find({ type: 'user' }, (err, docs: any[]): boolean => {
    if (docs.length > 0) {
      return false
    }
    return true
  })
}

const main = async (): Promise<void> => {
  const db = await new Nedb({
    filename: `${__dirname}/configs/database`,
    autoload: true
  })
  if (userCheck(db)) {
    await Login(db)
    return
  }

  program
    .option('-l, --login', 'ログインする')
    .option('-lo, --logout', 'ログアウトする')
    .option('-t, --tweet [tweet]', 'ツイートする')
    .option('-tl, --timeline', 'タイムラインを取得します')
    .option('-c, --console', 'testだよ')
    .parse(process.argv)

  if (program.login) Login(db)
  if (program.tweet) {
    if (typeof program.tweet === 'string') {
      tweet(db, program.tweet)
      return
    }
    tweet(db, '')
    return
  }
  if (program.console) {
    db.find({ selected: true }, async (err, result) => {
      if (!err) {
        console.log(result.slice(-1)[0])
      }
    })
  }
  // For default, show help
  const NO_COMMAND_SPECIFIED = process.argv.length <= 2
  if (NO_COMMAND_SPECIFIED) {
    // e.g. display usage
    program.help()
  }
}

export default main
