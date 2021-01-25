const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: "node",
  mode: 'production',
  entry: {
    server: {
      import: './src/server/index.js',
      filename: 'main.js'
    },
    ui: {
      import: './src/static/main.js',
      filename: 'static/main.js'
    }
  },

  plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin({
            template: './src/static/index.html',
            filename: 'static/index.html'
          })],

  module: {
    rules: [{
      test: /\.node$/,
      loader: 'node-loader',
    }]
  }
}