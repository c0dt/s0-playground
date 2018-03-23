let path = require('path');
let webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryFile = process.env.ENTRY_FILE;

let definePlugin = new webpack.DefinePlugin({
  '__DEBUG__': true
});

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, entryFile)
    ],
    "s0-engine": ["s0-engine"]
  },
  devtool: 'source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'build/debug'),
    filename: 'js/[name].js'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 's0-engine',
          test: 's0-engine',
          enforce: true
        },
      }
    },
  },
  plugins: [
    definePlugin,
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      { 
        test: /\.js$/, 
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules\//
      },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', include: [ path.join(__dirname, 'packages') ], exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', include: [ path.join(__dirname, 'packages') ], exclude: /node_modules/ },
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  mode: "development"
};