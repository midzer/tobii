import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

export default [
  // browser-friendly UMD build
  {
    input: 'src/js/tobii.js',
    output: {
      name: 'Tobii',
      file: './dist/js/tobii.js',
      format: 'umd'
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        presets: [
          [
            '@babel/preset-env', {
              modules: false,
              loose: true
            }
          ]
        ]
      })
    ]
  },
  // Minfied browser-friendly UMD build
  {
    input: 'src/js/tobii.js',
    output: {
      name: 'Tobii',
      file: './dist/js/tobii.min.js',
      format: 'umd'
    },
    plugins: [
      babel({
        presets: [
          [
            '@babel/preset-env', {
              modules: false,
              loose: true
            }
          ]
        ]
      }),
      minify({
        comments: false
      })
    ]
  },
  // CommonJS (for Node) build
  {
    input: 'src/js/tobii.js',
    output: {
      file: './dist/js/tobii.cjs.js',
      format: 'cjs'
    },
    plugins: [
      babel({
        presets: [
          [
            '@babel/preset-env', {
              modules: false,
              loose: true
            }
          ]
        ]
      })
    ]
  }
]
