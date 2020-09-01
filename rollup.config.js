import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import shebang from 'rollup-plugin-preserve-shebang'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.ts',
  output: {
    file: './lib/index.js',
    format: 'cjs'
  },
  external: [
    'axios',
    'commander',
    'nedb',
    'open',
    'ora',
    'pjson',
    'prompts',
    'update-notifier'
  ],
  plugins: [
    shebang(),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015',
          moduleResolution: 'node'
        }
      }
    }),
    nodeResolve({ jsnext: true }),
    commonjs(),
    json(),
    babel(),
    terser()
  ]
}
