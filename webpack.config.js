const path = require('path');
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest')

module.exports = {
  entry: './src/client.tsx',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },{
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      title: 'Cath',
      filename: 'index.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'mobile-web-app-capable': 'yes',
      },
    }),
    new WebpackPwaManifest(require('./manifest.json'))
  ]
};
