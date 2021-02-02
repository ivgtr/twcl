import { program } from 'commander'
import pjson from 'pjson'
import updateNotifier from 'update-notifier'
import { operationUser, tweet, showTweet } from './utils/parser'

program
  .command('user')
  .alias('u')
  .description('User Add/Delete/Change operation')
  .option('-a, --add', 'Add a User')
  .option('-d, --delete', 'Delete a User')
  .option('-c, --change', 'Change a User')
  .action((options: { add?: boolean; delete?: boolean; change?: boolean }) => {
    operationUser(options)
  })
program
  .command('tweet')
  .alias('t')
  .description('Tweet now')
  .option('-t, --tweet <TWEET>', 'Tweet shortcut')
  .option('-f, --filepath <FILE_PATH>', 'Set the path to the image file')
  .action((options: { tweet?: string; filepath?: string }) => {
    tweet(options)
  })

program
  .command('show')
  .alias('s')
  .description('Show the Timeline/List/User/Search')
  .option('-t, --timeline', 'Show the your Timeline')
  .option('-l, --list', 'Show the List')
  .option('-u, --user <USER_ID>', 'Show the User')
  .option('-s, --search <QUERY>', 'Show the Search result')
  .option('-c, --count <SHOW_TWEET_COUNT>', 'Tweets on display count')
  .action(
    (options: {
      timeline?: boolean
      list?: boolean
      user?: string
      search: string
      count: number
    }) => {
      showTweet(options)
    }
  )

program
  .command('wzap')
  .alias('w')
  .description('Wazap Command')
  .option('-f, --follow <TWITTER_ID>', 'Follow the Account with all Registered User')
  .option('-l, --like <TWEET_ID>', 'Like/Favorite the tweet with all Registered User')
  .option('-r, --retweet <TWEET_ID>', 'Retweet the tweet with all Registered User')
  .option('-t, --tweet <TWEET>', 'Tweet with all Registered User')
  .action((options: { follow?: string; like?: string; retweet?: string; tweet?: string }) => {
    console.log(options)
  })

export default (argv: string[]) => {
  updateNotifier({ pkg: pjson }).notify()

  program
    .name('twcl')
    .usage('[command]')
    .version(pjson.version, '-v, --version', "Show the twcl's version")
    .helpOption('-h, --help', 'display help for command')
    .addHelpText(
      'after',
      `
Example call:
  $ twcl tweet
  $ twcl show -t -c 60`
    )
    .parse(argv)
}
