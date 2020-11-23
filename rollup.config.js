import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'
import { terser } from 'rollup-plugin-terser'
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel'
import license from 'rollup-plugin-license'
import cssnano from 'cssnano'

const pkg = require('./package.json')
const banner = ['/**\n *', pkg.name, pkg.version, '\n *\n */'].join(' ')

const commonJSBuild = {
  input: {
    'tobii.cjs.js': 'src/js/node-entry.js'
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**'
    }),
    license({
      banner
    })
  ],
  output: {
    dir: 'dist/js',
    entryFileNames: '[name]',
    exports: 'auto',
    format: 'cjs',
    freeze: false,
    sourcemap: false
  }
}

const esmBuild = {
  ...commonJSBuild,
  input: {
    'tobii.es.js': 'src/js/node-entry.js'
  },
  output: {
    ...commonJSBuild.output,
    format: 'es'
  }
}

const browserBuilds = {
  input: 'src/js/browser-entry.js',
  plugins: [
    resolve({
      browser: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    eslint({
      include: [
        './src/js/tobii.js'
      ]
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          corejs: 3.6,
          useBuiltIns: 'usage'
        }]
      ]
    }),
    postcss({
      plugins: [
        require('postcss-preset-env')
      ],
      extract: '@/../../css/tobii.css'
    }),
    license({
      banner
    })
  ],
  output: [
    { file: 'dist/js/tobii.browser.umd.js', format: 'umd', name: 'Tobii', banner },
    { file: 'dist/js/tobii.browser.es.js', format: 'es', banner }
  ]
}

const browserMinifyBuilds = {
  input: 'src/js/browser-entry.js',
  plugins: [
    resolve({
      browser: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    eslint({
      include: [
        './src/js/tobii.js'
      ]
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          corejs: 3.6,
          useBuiltIns: 'usage'
        }]
      ]
    }),
    postcss({
      plugins: [
        require('postcss-preset-env'),
        cssnano
      ],
      extract: '@/../../css/tobii.min.css'
    }),
    terser(),
    license({
      banner
    })
  ],
  output: [
    {
      file: 'dist/js/tobii.browser.umd.min.js',
      format: 'umd',
      name: 'Tobii'
    },
    {
      file: 'dist/js/tobii.browser.es.min.js',
      format: 'es'
    }
  ]
}

export default [commonJSBuild, esmBuild, browserBuilds, browserMinifyBuilds]

/* export default [{
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
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          corejs: 3.6,
          useBuiltIns: 'usage'
        }]
      ]
    }),
    postcss({
      plugins: [
        require('postcss-preset-env')
      ],
      extract: '@/../../css/tobii.css'
    }),
    license({
      banner
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
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          corejs: 3,
          useBuiltIns: 'usage'
        }]
      ]
    }),
    postcss({
      plugins: [
        require('postcss-preset-env'),
        cssnano
      ],
      extract: '@/../../css/tobii.min.css'
    }),
    terser(),
    license({
      banner
    })
  ],
  watch: {
    clearScreen: false
  }
}]
*/
