import dayjs from 'dayjs'
import colors from './console'

const viewTweet = (
  data: {
    time: string
    id: string
    name: string
    text: string
    retweet: number
    favorite: number
  }[]
): void => {
  data.forEach((item) => {
    const time = dayjs(item.time).format('YYYY/MM/DD HH:mm:ss')
    console.log(
      `${colors.yellow(item.name)} ${colors.blue(item.id)} ${colors.magenta(
        `${time}`
      )}\n${item.text}\n${colors.green(`🔬:${item.retweet}`)} ${colors.red(
        `❤️:${item.favorite}`
      )}\n`
    )
  })
}

export default viewTweet
