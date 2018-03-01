# React

## Установка модулей для разработки
```
npm install --save-dev webpack webpack-cli babel-loader babel-core babel-preset-env babel-preset-react babel-polyfill 
```
* babel-polyfill - для старых браузеров
* babel - для написания кода в ES6
* webpack - для сборки кода в единый файл (Версия 2.1.0-beta.22 !!!)

## Cам React.js
```
npm install react react-dom raf
```
* raf - для старых браузеров

## Уменьшение кода js (замена react)
```
npm install --save preact preact-compat
```
см. webpack.config.js

## Конфигурация webpack
```
touch webpack.config.js
```
```
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
```
## Отладка ReactJs приложения
Отладить код можно с помощью [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) для браузера Chome