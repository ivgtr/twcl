import program from 'commander'
import Nedb from 'nedb'
import pjson from 'pjson'

import tweet from './commands/tweet'
import timeline from './commands/timeline'
import list from './commands/list'
import { Login, Logout } from './commands/oauth'

const path = `${__dirname}/configs/database`

const main = async (): Promise<void> => {
  const db = await new Nedb({
    filename: path
  })
  await db.loadDatabase()

  const userCheck = await new Promise((resolve) => {
    db.findOne({ selected: true }, (err, doc) => {
      if (!doc) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })

  if (!userCheck) {
    await Login(db)
    return
  }

  program
    .version(pjson.version, '-v, --version', 'バージョンを確認')
    .option('-l, --login', 'ログイン')
    .option('-lo, --logout', 'ログアウト')
    .option('-t, --tweet [tweet]', 'ツイート')
    .option('-tl, --timeline [user]', 'タイムラインを取得')
    .option('-li, --list [user/list]', 'リストを取得')
    .option('-c, --change', 'アカウント切替')
    .parse(process.argv)

  if (program.login) Login(db)
  if (program.logout) Logout(db, path)
  if (program.tweet) {
    if (typeof program.tweet === 'string') {
      tweet(db, program.tweet)
      return
    }
    tweet(db, '')
    return
  }
  if (program.timeline) {
    if (typeof program.timeline === 'string') {
      if (program.timeline.charAt(0) === '@') {
        const userId = program.timeline.slice(1)
        timeline(db, userId)
        return
      }
      timeline(db, program.timeline)
      return
    }
    timeline(db, '')
    return
  }
  if (program.list) {
    if (typeof program.list === 'string') {
      list(db, {
        listid: program.list
      })
      return
    }
    list(db, {})
    return
  }
  if (program.change) {
    console.log('アカウント切替機能')
    console.log('実装中')
    db.find({ selected: true }, async (err, result) => {
      if (result.length) {
        console.log(`ログイン中のアカウント: ${result.slice(-1)[0].name}`)
      } else {
        console.log('ログインしていません')
      }
    })
  }
  // For default, show help
  const NO_COMMAND_SPECIFIED = process.argv.length <= 2
  if (NO_COMMAND_SPECIFIED) {
    db.find({ selected: true }, async (err, result) => {
      if (result.length) {
        console.log(`${result.slice(-1)[0].name} でログインしています`)
      } else {
        console.log('ログインしていません')
      }
    })
  }
}

export default main
