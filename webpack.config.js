var path = require('path');

var commonLoaders = [
  { test: /\.js$/, loader: "jsx-loader" },
  { test: /\.png$/, loader: "url-loader" },
  { test: /\.jpg$/, loader: "file-loader" },
];

var assetsPath = path.join(__dirname, "public", "assets");
var publicPath = "assets/";

module.exports = [{
  entry: "./app/main.js",
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
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
      { test: /\.css$/, loader: "style!css" }
    ]
  },
  devServer: {
    proxy: {
      '/api/': {
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
      },
      '/assets/': {
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