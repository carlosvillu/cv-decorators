var path = require('path');

module.exports = {
  entry: [
    path.resolve(__dirname, 'docs/index.jsx')
  ],
  output: {
    path: path.resolve(__dirname, 'docs/'),
    filename: 'dist/index.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  }
};
