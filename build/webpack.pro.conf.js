const path = require('path');
const merge = require('webpack-merge');
const config = require('../config/index.js');
const utils = require('./utils.js');
const webpack = require('webpack');
const webpackBaseConf = require('./webpack.base.conf.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(webpackBaseConf, {
  mode: "production",
  output: {
    filename: utils.assetsPath("js/[name].[chunkhash].js"),
    chunkFilename: utils.assetsPath("js/[name].[chunkhash].js"),
  },
  module: {
    rules: utils.styleLoaders({ 
      sourceMap: false, 
      usePostCSS: false, 
      extract: true, 
      minimize: true,
      issuer: (path) => {
        return !path.match(/[\\/]html/);
      }
    }).concat(utils.styleLoaders({  // 此处是为了支持直接在html文件中引入css文件
      sourceMap: false, 
      usePostCSS: false, 
      file: true, 
      minimize: true,
      issuer: /[\\/]html/,
      filename: utils.assetsPath("css/[name].[hash:7].[ext]"),
    }))
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: Math.ceil(Object.keys(webpackBaseConf.entry).length / 2) || 2,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          name: "vendors"//utils.assetsPath("vendor"),
        },
        common: {
          test: /[\\/]src[\\/]/,
          chunks: "all",
          name: "common"
        }
      }
    }
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: utils.assetsPath("css/[name].[contenthash].css"),
      chunkFilename: utils.assetsPath("css/[name].[contenthash].css")
    }),
    new BundleAnalyzerPlugin()
  ],
});