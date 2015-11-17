var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'docs/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'docs/dist'),
    filename: 'dist/index.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: path.join(__dirname, 'node_modules')
      }]
  },
  plugins: []
};
