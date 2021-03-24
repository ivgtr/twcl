/* eslint node/no-unpublished-require:0 */
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const json = require('@rollup/plugin-json')
const { babel } = require('@rollup/plugin-babel')
const typescript = require('@rollup/plugin-typescript')
const shebang = require('rollup-plugin-preserve-shebang')
const { terser } = require('rollup-plugin-terser')

module.exports = {
  input: './src/index.ts',
  output: {
    file: './lib/index.js',
    format: 'cjs',
    exports: 'default'
  },
  external: [
    'axios',
    'dayjs',
    'commander',
    'nedb',
    'open',
    'ora',
    'pjson',
    'inquirer',
    'update-notifier'
  ],
  plugins: [
    shebang(),
    typescript({
      module: 'es2015',
      moduleResolution: 'node'
    }),
    nodeResolve({ jsnext: true }),
    commonjs(),
    json(),
    babel(),
    terser()
  ]
}
