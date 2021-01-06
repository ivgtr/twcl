import program from 'commander'
import pjson from 'pjson'
import updateNotifier from 'update-notifier'

program
  .version(pjson.version, '-v, --version', 'バージョンを確認')
  .helpOption('-h, --help', 'コマンド一覧を表示')

const main = (argv: any) => {
  updateNotifier({ pkg: pjson }).notify()

  program.parse(argv)
}

main(process.argv)
