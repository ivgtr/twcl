import Twitter from 'twitter'
import {
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET_KEY
} from '../configs/config.json'

const client = new Twitter({
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET_KEY,
  access_token_key: '',
  access_token_secret: ''
})

const Tweet = async (): Promise<void> => {
  const content = '帰る'
  await client.post(
    'statuses/update',
    { status: content },
    (error, tweet, response) => {
      if (!error) {
        console.log(`tweet success: ${tweet}`)
      } else {
        console.log(error)
      }
    }
  )
}

export default Tweet
