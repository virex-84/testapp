var webpack = require("webpack");

const isDevelopment = !process.env.NODE_ENV;
const isProduction = process.env.NODE_ENV;

const config = {
  entry: {
    'js/main.js':'./assets/js/main.js'
  },
  output: {
    path: __dirname + '/public/',
    filename: "[name]"
  },
  module: {
    loaders: [
      {
        test: /.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ["env", "react"]
        }
      },      
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: '/assets/js/bootstrap.min.js',
        query: {
          presets: ["env"]
        }
      },
    ]
  }
  ,plugins: [
    // expose $ and jQuery to global scope.
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
  ]
};

if (isProduction) {
  
  // максимальное сжатие
  config.plugins.push(
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
  );
  
  // отладка React Developer Tools будет невозможной)
  config.resolve={
    alias: {
     'react': 'preact-compat',
     'react-dom': 'preact-compat',
    }
  };
}

module.exports = config;