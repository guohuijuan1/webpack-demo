const path = require('path');
const glob = require("glob");
var HtmlWebpackPlugin = require('html-webpack-plugin');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, 'src/*/index.js'))
  Object.values(entryFiles).map(val => {
    const filename = val.match(/\/src\/([a-zA-Z0-9]*)\/index.js/)[1]
    entry[filename] = val;
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: path.join(__dirname, `src/${filename}/index.html`),
      chunks: [filename],
      filename: `${filename}.html`,
    }))
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

// loader 用于文件转换，将其他文件类型转换成有效的模块，将之添加到依赖图中；接受源文件作为参数，返回转换结果
// plugin 用于bundel 文件的优化、资源管理、环境变量的注入等；作用于整个构建过程
module.exports = {
  // entry: './src/index.js',
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  // 设置 process.env.NODE_ENV 的值，并开启一些优化选项
  // https://webpack.js.org/configuration/mode/#root
  mode: 'development',
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader'
      },
      {
        test: /.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /.(png|gif|svg|jpg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'img/[name][hash:8].[ext]'
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
            limit: 102400,
          }
        }]
      }
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  // https://webpack.js.org/configuration/watch/#root
  watch: true,
  watchOptions:{
    ignored: /node_modules/,
    aggregateTimeout: 600,
    poll: 1000,
  }
};