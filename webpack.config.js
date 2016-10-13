 module.exports = {
   entry: './temp/renderer-react-components/app-main.js',
   output: {
     path: './renderer/js',
     filename: 'renderer-app-react.js',
   },
   resolve: {
     extensions: ['', '.js'],
   },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    }
 }