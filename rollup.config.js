import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

export default [
  {
    input: 'src/js/tobii.js',
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env', {
              loose: true
            }
          ]
        ]
      })
    ],
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
    ]
  },
  // Minfied browser-friendly UMD build
  {
    input: 'src/js/tobii.js',
    plugins: [
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [
          [
            '@babel/preset-env', {
              loose: true
            }
          ]
        ]
      }),
      minify({
        comments: false
      })
    ],
    output: {
      name: 'Tobii',
      file: './dist/js/tobii.min.js',
      format: 'umd'
    }
  }
]
