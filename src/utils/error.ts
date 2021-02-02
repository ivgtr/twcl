import chalk from 'chalk'

export default (error: any) => {
  console.log(
    `${chalk.red('✖')} ${
      error.response.data.message.message ||
      error.response.data.message ||
      'Twitter API Error, Try again'
    }`
  )
}
