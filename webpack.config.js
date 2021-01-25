const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require("copy-webpack-plugin");

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

  plugins: [new webpack.ProgressPlugin(),
          new CopyPlugin({
            patterns: [
              { from: "src/static/main.css", to: "static/main.css" },
              { from: "src/static/index.html", to: "static/index.html" }
            ],
          })],

  module: {
    rules: [{
      test: /\.node$/,
      loader: 'node-loader',
    }]
  }
}