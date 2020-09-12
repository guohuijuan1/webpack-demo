'use strict'
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// loader 用于文件转换，将其他文件类型转换成有效的模块，将之添加到依赖图中；接受源文件作为参数，返回转换结果
// plugin 用于bundel 文件的优化、资源管理、环境变量的注入等；作用于整个构建过程
module.exports = {
  // entry: './src/index.js',
  entry: {
    index: './src/index.js',
    index2: './src/index2.js',
  },
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 设置 process.env.NODE_ENV 的值，并开启一些优化选项
  // https://webpack.js.org/configuration/mode/#root
  mode: 'production',
  // mode: 'development',
  // mode: 'none',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        // https://webpack.js.org/loaders/css-loader/#root
        test: /.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /.(png|gif|svg|jpg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name]_[hash:8].[ext]'
          }
        }],
      },
      // {
      //   test: /.(TTF|woff|woff2|otf|eot)$/,
      //   use: 'file-loader'
      // },
      {
        test: /.(TTF|woff|woff2|otf|eot)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10240,
            name: 'font/[name]_[hash:8].[ext]',
          }
        }]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name]_[contenthash:8].css',
      // chunkFilename: '[id].css',
    }),
  ],
};