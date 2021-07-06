const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

// import webpack from 'webpack'
// import HtmlWebpackPlugin from 'html-webpack-plugin'
// import CopyPlugin from 'copy-webpack-plugin'
// import path from 'path'

const { NODE_ENV = 'development' } = process.env

const icons = [16, 32, 128].map(size => ({ from: `./src/icon/icon${size}.png`, to: `./icon${size}.png` }))

const base = {
  context: __dirname,
  entry: {
    background: './src/background/index.js',
    'content-script': './src/content-scripts/index.js',
    popup: './src/popup/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-transform-runtime",
              [
                require("babel-plugin-transform-imports"),
                {
                  "@material-ui/core": {
                    transform: function(importName, matches) {
                      return "@material-ui/core/esm/" + importName;
                    },
                    preventFullImport: true
                  },
                  "@material-ui/icons": {
                    transform: function(importName, matches) {
                      return "@material-ui/icons/esm/" + importName;
                    },
                    preventFullImport: true
                  }
                }
              ]
            ]
          }
        }
      },
      {
        test: /plugin\.css$/,
        use: ["style-loader", "css"]
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(svg|png|jpe?g|gif|pdf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]"
            }
          }
        ],
        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: "url-loader"
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './src/manifest.json', to: './manifest.json' },
        { from: `./src/icon/record32.png`, to: `./record32.png` },
        ...icons
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/template.html',
      chunks: ['popup']
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    })
  ]
}

const production = {
  ...base,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'production',
  devtool: false,
  plugins: [
    ...base.plugins,
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
}

module.exports = production
