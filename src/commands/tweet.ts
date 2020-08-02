import Twitter from 'twitter'
import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET_KEY
} from '../configs/config.json'

const client = new Twitter({})

const Tweet = async () => {
  console.log('やあ')

  await setTimeout(() => {
    console.log('test')
  }, 1000)
}

export default Tweet
