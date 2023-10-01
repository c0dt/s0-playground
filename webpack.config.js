let path = require('path');
let webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const entryFile = process.env.ENTRY_FILE || 'src/M';

let definePlugin = new webpack.DefinePlugin({
  '__DEBUG__': true
});

module.exports = {
  entry: {
    app: [
      path.resolve(__dirname, entryFile)
    ],
    // "test-worker": [
    //   path.resolve(__dirname, 'src/Test.worker.js')
    // ],
    "s0-engine": ["s0-engine"]
  },
  devtool: 'source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'build/debug'),
    filename: 'js/[name].js',
    globalObject: 'this'
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
      // {
      //   test: /\.worker\.js$/,
      //   use: { loader: 'worker-loader' }
      // },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', include: [ path.join(__dirname, 'src'), path.join(__dirname, 'packages') ], exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', include: [ path.join(__dirname, 'src'), path.join(__dirname, 'packages') ], exclude: /node_modules/ },
    ]
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  mode: "development"
};