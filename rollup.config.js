import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'

import license from 'rollup-plugin-license'
import filesize from 'rollup-plugin-filesize'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import stylelint from 'rollup-plugin-stylelint'

const pkg = require('./package.json')
const banner = ['/**\n *', pkg.name, pkg.version, '\n *\n */'].join(' ')

export default [{
  input: './src/js/tobii.js',
  output: [
    {
      sourcemap: false,
      name: 'Tobii',
      file: './dist/js/tobii.js',
      format: 'umd'
    },
    {
      sourcemap: false,
      name: 'Tobii',
      file: './dist/js/tobii.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    eslint({
      include: [
        './src/js/tobii.js'
      ]
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          corejs: 3.6,
          useBuiltIns: 'usage'
        }]
      ]
    }),
    stylelint({
      fix: false,
      include: [
        './src/scss/**.scss'
      ],
      syntax: 'scss',
      quiet: false
    }),
    postcss({
      plugins: [
        autoprefixer
      ],
      extract: '@/../../css/tobii.css'
    }),
    license({
      banner
    }),
    filesize({
      showMinifiedSize: false
    })
  ],
  watch: {
    clearScreen: false
  }
},
{
  input: './src/js/tobii.js',
  output: {
    sourcemap: false,
    name: 'Tobii',
    file: './dist/js/tobii.min.js',
    format: 'umd'
  },
  plugins: [
    resolve({
      browser: true
    }),
    commonjs(),
    eslint({
      include: [
        './src/js/tobii.js'
      ]
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          corejs: 3,
          useBuiltIns: 'usage'
        }]
      ]
    }),
    stylelint({
      fix: false,
      include: [
        './src/scss/**.scss'
      ],
      syntax: 'scss',
      quiet: false
    }),
    postcss({
      plugins: [
        autoprefixer,
        cssnano
      ],
      extract: '@/../../css/tobii.min.css'
    }),
    terser(),
    license({
      banner
    }),
    filesize({
      showMinifiedSize: false
    })
  ],
  watch: {
    clearScreen: false
  }
}]
