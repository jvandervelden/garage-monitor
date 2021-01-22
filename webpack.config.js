const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: "node",
  mode: 'development',
  entry: './src/server/index.js',

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