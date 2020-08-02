import program from 'commander'

import tweet from './commands/tweet'
import { Login } from './commands/auth'

const main = (): void => {
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
