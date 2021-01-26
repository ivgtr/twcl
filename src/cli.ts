#!/usr/bin/env node

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
  .option('-i, --image <FILE_PATH>', 'Attach an image')
  .action((options: { tweet?: string; image?: string }) => {
    tweet(options)
  })

program
  .command('show')
  .alias('s')
  .description('Show the Timeline/List/User/Search')
  .option('-t, --timeline', 'Show the your Timeline')
  .option('-l, --list', 'Show the List')
  .option('-u, --user <USER_ID>', 'Show the User')
  .option('-s, --search <SERCH_WORD>', 'Show the Search result')
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

const main = (argv: string[]) => {
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

export default main(process.argv)
