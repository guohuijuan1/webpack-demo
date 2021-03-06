'use strict'
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// https://v4.webpack.js.org/plugins/uglifyjs-webpack-plugin/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// https://webpack.js.org/plugins/css-minimizer-webpack-plugin/#root
// https://cssnano.co/
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const glob = require("glob")

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, 'src/*/index-server.js'))
  Object.values(entryFiles).map(val => {
    const match = val.match(/\/src\/([a-zA-Z0-9]*)\/index-server.js/);
    const filename = match && match[1]
    entry[filename] = val;
    if (filename) {
      htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        inlineSource: '.css$',
        inject: true,
        template: path.join(__dirname, `src/${filename}/index.html`),
        scriptLoading: 'defer',
        chunks: [filename],
        filename: `${filename}.html`,
        minify:{
          //删除注释
          removeComments:false,
          //删除空格
          collapseWhitespace:true
        }
      }))
    }
  })
  return {
    entry,
    htmlWebpackPlugins,
  }
}
const {
  entry,
  htmlWebpackPlugins,
} = setMPA()
console.log(entry)

// loader 用于文件转换，将其他文件类型转换成有效的模块，将之添加到依赖图中；接受源文件作为参数，返回转换结果
// plugin 用于bundel 文件的优化、资源管理、环境变量的注入等；作用于整个构建过程
module.exports = {
  entry,
  output: {
    filename: '[name]-server.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  // 设置 process.env.NODE_ENV 的值，并开启一些优化选项
  // https://webpack.js.org/configuration/mode/#root
  mode: 'production',
  // mode: 'development',
  // mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // 'eslint-loader',
          'babel-loader',
        ]
      },
      {
        // https://webpack.js.org/loaders/css-loader/#root
        test: /\.less$/,
        // use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
        use: [
          MiniCssExtractPlugin.loader, 
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // https://github.com/postcss/autoprefixer
                    'autoprefixer',
                    {
                      // browsers: [
                      //   "last 1 version",
                      //   "> 1%",
                      //   "IE 10"
                      // ]
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              // 1 rem = 75 px;
              remUni: 75,
              remPrecision: 8
            }
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|gif|svg|jpg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]'
          }
        }],
      },
      // {
      //   test: /\.(TTF|woff|woff2|otf|eot)$/,
      //   use: 'file-loader'
      // },
      {
        test: /\.(TTF|woff|woff2|otf|eot)$/,
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
    new CleanWebpackPlugin(),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: {
            path: 'https://unpkg.com/react@16/umd/react.production.min.js',
            attributes: {
              // integrity: 'sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=',
              crossorigin: 'anonymous',
            },
          },
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: {
            path: 'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js',
            attributes: {
              crossorigin: 'anonymous',
            },
          },
          global: 'ReactDOM',
        },
      ],
    }),
    ...htmlWebpackPlugins,
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name]_[contenthash:8].css',
      // chunkFilename: '[id].css',
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    }
  },
};