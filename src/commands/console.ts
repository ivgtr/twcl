const color = (col) => (str) => `\u001b[${col}m${str}\u001b[0m`

const colors = {
  black: color('30'),
  red: color('31'),
  green: color('32'),
  yellow: color('33'),
  blue: color('34'),
  magenta: color('35'),
  cyan: color('36'),
  white: color('37')
}

export default colors
