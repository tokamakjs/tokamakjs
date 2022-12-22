import path from 'path';

import HtmlPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx'],
    symlinks: false,
    plugins: [new TsconfigPathsPlugin()],
    modules: ['node_modules', 'vendor'],
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlPlugin({ filename: 'index.html', template: 'public/index.html' }),
    new webpack.EnvironmentPlugin(['NODE_ENV']),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
              compilerOptions: {
                noUnusedLocals: false,
                noUnusedParameters: false,
              },
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        // These packages don't provide their source
        exclude: [
          /react-mapbox-wrapper/,
          /urql-computed-exchange/,
          /use-filters/,
          /react-router/,
          /zod/,
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'css/[name].[ext]',
            },
          },
          'extract-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'images/[name].[ext]',
          },
        },
      },
    ],
  },
};

// @ts-ignore
config.devServer = {
  host: '0.0.0.0',
  port: 4200,
  historyApiFallback: true,
  hot: true,
};

export default config;
