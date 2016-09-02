var path = require('path');

module.exports = {
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
};