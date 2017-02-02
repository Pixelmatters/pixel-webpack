const webpack = require('webpack')
// const NotifierPlugin = require('webpack-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const plugins = [];

plugins.push(
  new webpack.DefinePlugin({
    DEVMODE: true
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    inject: 'body'
  }),
  new ExtractTextPlugin('[name].css')
);

const preLoaders = [{
  test: /\.js$/,
  loader: 'eslint',
  include: ['./src'],
  exclude: /node_modules/
}];

const postcss = [
  require('autoprefixer')({
    browsers: [
      'Android 2.3',
      'Android >= 4',
      'Chrome >= 20',
      'Firefox >= 24',
      'Explorer >= 8',
      'iOS >= 6',
      'Opera >= 12',
      'Safari >= 6'
    ]
  })
];

const loaders = [{
    test: /\.scss$/,
    exclude: /node_modules/,
    // loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
    loaders: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
  },
  {
    test: /\.js$/,
    loader: 'babel',
    include: ['./src'],
    exclude: /node_modules/
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'ts-loader'
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/,
    exclude: /node_modules/,
    loader: 'url',
    query: {
      limit: 500,
      name: '/assets/images/[name].[hash:7].[ext]'
    }
  },
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    loader: 'url',
    query: {
      limit: 10000,
      name: '/assets/fonts/[name].[hash:7].[ext]'
    }
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
    path: './dist',
    publicPath: '/',
    // filename for the entry points
    filename: '[name].[hash].bundle.js',
    // filename for non entry points
    chunkFilename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['', '.ts', '.js', '.tsx', '.html'],
    fallback: ['./node_modules'],
  },
  module: {
    preLoaders,
    loaders
  },
  plugins,
  postcss
}

module.exports = config