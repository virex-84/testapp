var webpack = require("webpack");

module.exports = {
  entry: './react/app.js',
  output: {
    path: __dirname + '/public/js/',
    filename: 'reactapp.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["env", "react"]
        }
      }
    ]
  }
  /* //раскомментируйте для максимального сжатия
  ,plugins: [
    new webpack.optimize.UglifyJsPlugin({
     minimize: true,
     mangle: true,
     sourcemap: false,
     comments: false,
     compress: {
       warnings: false,
       drop_console: true,
     }
    })
  ],
  resolve: {
    alias: {
     'react': 'preact-compat',
     'react-dom': 'preact-compat'
    },    
  }
  */
};