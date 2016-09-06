var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ReactToHtmlPlugin = require('react-to-html-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var commonLoaders = [
  { test: /\.js$/, loader: "jsx-loader" },
  { test: /\.png$/, loader: "url-loader" },
  { test: /\.jpg$/, loader: "file-loader" },
];

var assetsPath = path.join(__dirname, "public", "assets");
var publicPath = "assets/";

module.exports = [{
  entry:
  {
    "main": "./src/app/main.js",
    "account/sign-in": "./src/app/Account/SignIn.jsx"
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name]-bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel",
        query: {
          presets: [
            "react",
            "es2015"
          ]
        }
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin('style.css', { allChunks: true }),

    // 默认页面
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/html/index.html',
      inject: true,
      chunks: ['index']
    }),

    // 登陆页面
    new HtmlWebpackPlugin({
      filename: 'account/sign-in.html',               // http访问路径
      template: './src/html/account/sign-in.html',   // 实际文件路径
      inject: true,
      chunks: ['login']
    })
  ],
  devServer: {
    // 设置代理信息
    proxy: {
      '/api/': {
        "target": {
          "host": "localhost",
          "protocol": 'http:',
          "port": 30000,
          "secure": false
        }
      },
      '/locales/': {
        "target": {
          "host": "localhost",
          "protocol": 'http:',
          "port": 30000,
          "secure": false
        }
      },
      '/resources/': {
        "target": {
          "host": "localhost",
          "protocol": 'http:',
          "port": 30000,
          "secure": false
        }
      }
    }
  }
}];