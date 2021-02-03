import chalk from 'chalk'

export default (error: any) => {
  console.log(
    `${chalk.red('✖')} ${
      error.response
        ? error.response.data.message.message || error.response.data.message
        : error.message || 'Twitter API Error, Try again'
    }`
  )
}
