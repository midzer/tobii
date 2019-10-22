import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

export default [
  {
    input: 'src/js/tobii.js',
    output: {
      name: 'Tobii',
      file: './dist/js/tobii.js',
      format: 'umd'
    },
    plugins: [
      babel({
        presets: [
          [
            '@babel/preset-env', {
              modules: false
            }
          ]
        ]
      })
    ]
  },
  // Minfied version
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
              modules: false
            }
          ]
        ]
      }),
      minify({
        comments: false
      })
    ]
  }
]
