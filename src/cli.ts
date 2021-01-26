import program from 'commander'
import pjson from 'pjson'
import updateNotifier from 'update-notifier'

program
  .command('user')
  .description('User Add/Delete/Change Operation')
  .option('-a, --add', 'Add a User')
  .option('-d, --delete', 'Delete a User')
  .option('-c, --change', 'Change a User')
  .action((options: { add?: boolean; delete?: boolean; change?: boolean }) => {
    console.log(options.add)
    console.log(options.delete)
    console.log(options.change)
  })
program
  .command('tweet')
  .description('Tweet now')
  .option('-t, --tweet <TWEET>', 'Tweet shortcut')
  .action((options: { tweet?: string }) => {
    console.log(options.tweet)
  })

program
  .command('show')
  .description('Show the Timeline/List/User/Search')
  .option('-t, --timeline', 'Show the your Timeline')
  .option('-l, --list', 'Show the List')
  .option('-u, --User <USER_ID>', 'Show the User')
  .option('-s, --serch <SERCH_WORD>', 'Show the Search result')
  .action((options: { tweet?: string }) => {
    console.log(options.tweet)
  })

const main = (argv: string[]) => {
  updateNotifier({ pkg: pjson }).notify()

  program
    .name('twcl')
    .version(pjson.version, '-v, --version', "Show the twcl's version")
    .helpOption('-h, --help', 'display help for command')
    .parse(argv)
}

main(process.argv)
