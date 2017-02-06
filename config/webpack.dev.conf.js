const path = require('path');
const config = require('./config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrors = require('friendly-errors-webpack-plugin');

const preLoaders = [
  {
    test: /\.js$/,
    loader: 'eslint',
    include: [config.dev.sourcePath],
    exclude: /node_modules/
  }
];

const loaders = [{
    test: /\.scss$/,
    exclude: /node_modules/,
    loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
  },
  {
    test: /\.js$/,
    loader: 'babel-loader',
    include: [config.dev.sourcePath],
    exclude: /node_modules/,
    query: {
      presets: ['es2015', 'react', 'react-hmre']
    }
  },
  // {
  //   test: /\.less$/,
  //   exclude: /node_modules/,
  //   loader: "style!css!autoprefixer!less"
  // },
];

const plugins = [
  new webpack.DefinePlugin({
    'process.env': config.dev.env
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  // new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(config.dev.sourcePath, 'index.html'),
    inject: true
  }),
  new FriendlyErrors()
];

const webpackConfig = {
  devtool: '#eval-source-map',
  module: {
    preLoaders,
    loaders,
  },
  plugins
};

module.exports = webpackConfig;