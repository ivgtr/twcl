import { program } from 'commander'

import tweet from './commands/tweet'

program
  .option('-t, --tweet [tweet]', 'ツイートする')
  .option('-tl, --timeline', 'タイムラインを取得します')

program.parse(process.argv)

const main = async (program) => {
  if (program.tweet) {
    if (typeof program.tweet === 'string') {
      const t = tweet(program.tweet)
      if (t) {
        console.log('送信完了')
      } else {
        console.log('送信失敗')
      }
    } else {
      const t = await tweet()
      if (t) {
        console.log('送信完了')
      } else {
        console.log('送信失敗')
      }
    }
  }
}

export default main
