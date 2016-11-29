import buble from 'rollup-plugin-buble'

export default {
  entry: './temp/renderer-react-components/app-main.js',
  format: 'cjs',
  targets: [
    { dest: './renderer/js/renderer-app-react.js' }
  ],
  plugins: [
    buble(
      {
        target: {
          node: 4,
        }
      }
    )
  ]
}