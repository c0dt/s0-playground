let path = require('path');
let webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let definePlugin = new webpack.DefinePlugin({
  '__DEBUG__': false
});

module.exports = {
  entry: {
    "app": [
      path.resolve(__dirname, 'src/m')
    ],
    "s0-engine": ["s0-engine"]
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'build/release'),
    filename: 'js/[name]-min.js'
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
    // runtimeChunk: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
          dead_code: true,
          output: {
            comments(node, comment) {
              let text = comment.value;
              let type = comment.type;
              if (type === "comment2") {
                // multiline comment
                return /@copyright/i.test(text);
              }
            }
          }
        }
      })
    ]
  },
  plugins: [
    definePlugin,
    new CopyWebpackPlugin([
      { context: 'resources/', from: '**/*', to: './' },
    ]),
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
      // { test: /\.worker\.js$/, loader: "worker!babel?presets[]=es2015", include: [ path.join(__dirname, 'src') ], exclude: /node_modules/ }
    ]
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  mode: "production"
};