import inquirer from 'inquirer'

const main = (tweet?: string): boolean => {
  if (tweet) {
    console.log(tweet)
    return true
  }

  inquirer
    .prompt([
      {
        name: 'tweet',
        message: 'ツイートを入力',
        default: ''
      }
    ])
    .then((answers: any) => {
      console.log(answers.tweet)
      return true
    })
    .catch((e) => {
      console.log(e)
      return false
    })

  return false
}

export default main
