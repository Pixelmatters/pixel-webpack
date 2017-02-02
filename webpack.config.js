const webpack = require('webpack')
// const NotifierPlugin = require('webpack-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrors = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const plugins = [];

plugins.push(
  new webpack.DefinePlugin({
    'process.env': {dev: true}
  }),
  new HtmlWebpackPlugin({
    template: './index.html',
    inject: 'body',
    minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new ExtractTextPlugin('/assets/css/[name].[contenthash].css'),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.IgnorePlugin(/spec\.(js|ts)$/),
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
        mangle: true
      }),
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(__dirname, './node_modules')
        ) === 0
      )
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
  new ExtractTextPlugin('[name].[hash].css'),
  new FriendlyErrors(),
  new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        ['js', 'css'].join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
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

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

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
  devtool: '#eval-source-map',
  plugins,
  postcss
}

module.exports = config