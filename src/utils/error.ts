import chalk from 'chalk'

export default (error: { message: string }) => {
  console.log(`${chalk.red('✖')} ${error.message}`)
}
