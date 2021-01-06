import program from 'commander'
import pjson from 'pjson'
import updateNotifier from 'update-notifier'

program
  .command('user')
  .description('ユーザー操作')
  .option('-a, --add', 'ユーザー追加')
  .option('-d, --delete', 'ユーザー削除')
  .option('-c, --change', 'ユーザー切り替え')
  .action((options: { add?: boolean; delete?: boolean; change?: boolean }) => {
    console.log(options.add)
    console.log(options.delete)
    console.log(options.change)
  })
program
  .command('tweet')
  .description('ツイートする')
  .option('-t, --tweet <tweet>', 'パパパっとツイート')
  .action((options: { tweet?: string }) => {
    console.log(options.tweet)
  })

const main = (argv: string[]) => {
  updateNotifier({ pkg: pjson }).notify()

  program
    .name('twcl')
    .version(pjson.version, '-v, --version', 'バージョンを確認')
    .helpOption('-h, --help', 'コマンド一覧を表示')
    .parse(argv)
}

main(process.argv)
