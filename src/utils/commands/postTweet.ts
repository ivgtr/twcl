import fs from 'fs'
import { prompt } from 'inquirer'
import axios from 'axios'
// import chalk from 'chalk'
// import config from '../../configs/config.json'

// const proxyUrl = config.url.proxy

const submitTweet = async (tweet: string, image?: string) => {
  console.log(tweet, image)
}

const getPathImage = (filepath: string) => {
  return fs.readFileSync(filepath, 'base64')
}

const getUrlImage = (filepath: string) => {
  return axios
    .get(filepath, {
      responseType: 'arraybuffer'
    })
    .then((response) => {
      return Buffer.from(response.data, 'binary').toString('base64')
    })
}

function isURL(str: string) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return pattern.test(str)
}

const inputTweet = async (): Promise<string> => {
  const onCancel = () => {
    throw new Error('Could not confirm your input, Try again')
  }
  const { input } = await prompt<{ input: string }>({
    type: 'input',
    message: 'Tweet: ',
    name: 'input'
  }).catch(onCancel)
  return input
}

export const postTweet = async (tweet?: string, filepath?: string) => {
  const _tweet = tweet || (await inputTweet())
  if (!filepath) {
    return submitTweet(_tweet)
  } else if (isURL(filepath)) {
    const base64Image = await getUrlImage(filepath)
    submitTweet(_tweet, base64Image)
  } else {
    const base64Image = await getPathImage(filepath)
    submitTweet(_tweet, base64Image)
  }
}
