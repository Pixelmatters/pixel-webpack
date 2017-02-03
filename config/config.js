// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: {},
    distRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'assets',
    publicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    entryPoint: 'entry.ts',
    sourcePath: path.resolve(__dirname, '../src'),
    env: {},
    port: 8080,
    assetsSubDirectory: 'assets',
    assetsPublicPath: '/',
    proxyTable: {},
    env: {}
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
  }
}
