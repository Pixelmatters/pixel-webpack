const webpack = require('webpack')
// const NotifierPlugin = require('webpack-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const plugins = [];

plugins.push(
    new webpack.DefinePlugin({
      ENV: 'Something'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body'
    }),
    new ExtractTextPlugin('[name].css')
  );

const loaders = [
  {
    test: /\.scss$/,
    exclude: /node_modules/,
    // loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
    loaders: ['style-loader','css-loader', 'sass-loader']
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'ts-loader'
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    exclude: /node_modules/,
    loader: 'url-loader?limit=500&name=/assets/images/[hash].[ext]'
  },
  {
    test: /\.html$/,
    exclude: /node_modules/,
    loader: 'html-loader?attrs[]=img:src&attrs[]=img:image-loading-error'
  }
]

const config = {
  entry: './src/entry.ts',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders
  },
  plugins
}

module.exports = config