import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

export default [
  {
    input: './src/js/tobii.js',
    output: [
      {
        name: 'Tobii',
        file: './dist/js/tobii.js',
        format: 'umd'
      },
      {
        file: './dist/js/tobii.cjs.js',
        format: 'cjs'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          ['@babel/env', {
            corejs: 3.6,
            useBuiltIns: 'usage',
            loose: true
          }]
        ]
      })
    ]
  },
  // Minfied browser-friendly UMD build
  {
    input: './src/js/tobii.js',
    output: {
      name: 'Tobii',
      file: './dist/js/tobii.min.js',
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        presets: [
          ['@babel/env', {
            corejs: 3.6,
            useBuiltIns: 'usage',
            loose: true
          }]
        ]
      }),
      minify({
        comments: false
      })
    ]
  }
]
