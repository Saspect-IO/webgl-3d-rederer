const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ROOT = path.resolve(__dirname, 'src');

module.exports = {

  devtool: 'source-map',

  // bundling mode
  mode: 'production',

  // entry files
  entry: './src/main.ts',

  // output bundles (location)
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'bundle.js',
  },

  // file resolutions
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
    modules: [
      ROOT,
      'node_modules'
    ]
  },

  // loaders
  module: {
    rules: [{
        test: /\.tsx?/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          }
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'assets/resources',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|obj)$/i,
        type: 'assets/resources',
      },
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
};