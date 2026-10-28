import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import scss from 'rollup-plugin-scss';
 
const banner = `/*! Tobii | MIT License */`;
 
export default [
  {
    input: 'src/js/index.js',
    output: [
      { file: 'dist/tobii.js', format: 'cjs', sourcemap: false },
      { file: 'dist/tobii.module.js', format: 'es', sourcemap: false },
      {
        file: 'dist/tobii.umd.js',
        format: 'umd',
        name: 'Tobii',
        sourcemap: false
      },
      {
        file: 'dist/tobii.modern.js',
        format: 'es',
        sourcemap: false
      }
    ],
    plugins: [resolve()]
  },
  {
    input: 'src/js/browser.js',
    output: {
      file: 'dist/tobii.min.js',
      format: 'iife',
      name: 'Tobii',
      sourcemap: false
    },
    plugins: [
      resolve(),
      scss({
        fileName: 'tobii.min.css',
        sourceMap: false,
        outputStyle: 'compressed'
      }),
      terser()
    ]
  }
];
