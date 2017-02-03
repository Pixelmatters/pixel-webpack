const config = require('./config');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const loaders = [
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!sass-loader")
  }, 
  // {
  //   test: /\.less$/,
  //   loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader")
  // }
];

const plugins = [
  new webpack.DefinePlugin({
    'process.env': process.env
  }),
  new webpack.optimize.UglifyJsPlugin({
    mangle: true
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new ExtractTextPlugin(`/${config.build.assetsSubDirectory}/css/[name].[contenthash].css`),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    chunksSortMode: 'dependency'
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
          path.join(__dirname, '../node_modules')
        ) === 0
      )
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor']
  }),
  new webpack.IgnorePlugin(/spec\.(js|ts)$/)
];

if(gzip) {
  plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + ['js', 'css'].join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  );
}

const webpackConfig = {
  devtool: false,
  module : {
    loaders
  },
  plugins
};

module.exports = webpackConfig;