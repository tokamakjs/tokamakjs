const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  resolve: {
    symlinks: true,
  },
  context: path.resolve(__dirname, './'),
  entry: {},
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: '[name].js',
    library: 'jakte',
    libraryTarget: 'umd',
    sourceMapFilename: '[name].js.map',
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: ['babel-loader'],
      },
    ],
  },
};
