import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import banner from 'rollup-plugin-banner'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const TEST_DIR = '__test__'
const DIST_DIR = 'dist'
const IS_TEST_ENV = process.env.NODE_ENV === 'test'
const DIST_FILE_NAME = 'index.js'
const UMD_NAME = 'API'

export default {
  input: IS_TEST_ENV ? 'src/test.ts' : 'src/index.ts',
  output: {
    file: IS_TEST_ENV ? `${TEST_DIR}/${DIST_FILE_NAME}` : `${DIST_DIR}/${DIST_FILE_NAME}`,
    format: 'umd',
    name: UMD_NAME,
    sourcemap: !!IS_TEST_ENV
  },
  plugins: [
    resolve({ jsnext: true, preferBuiltins: true, browser: true }),
    commonjs(),
    typescript(),
    getBabelOutputPlugin({
      allowAllFormats: true,
      comments: false,
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: [
                'Android >= 4.4',
                'iOS >= 9.0'
              ]
            }
          }
        ]
      ]
    }),
    IS_TEST_ENV && serve(TEST_DIR),
    IS_TEST_ENV && livereload({
      delay: 500,
      watch: TEST_DIR,
      verbose: false
    }),
    !IS_TEST_ENV && terser(),
    !IS_TEST_ENV && banner('v<%= pkg.version %>')
  ]
}
