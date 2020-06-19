/// <reference path="../../../types/error-overlay-webpack-plugin.d.ts" />

import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';

import { BabelConfig } from '../../environment';

export function createWebpackConfig(entry: string, babel?: BabelConfig): Configuration {
  const webpackConfig: Configuration = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    optimization: {
      noEmitOnErrors: true,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin()],
      symlinks: false,
    },
    entry: { app: entry.startsWith('./') ? entry : `./${entry}` },
    output: {
      filename: 'js/[name].js',
      publicPath: '/',
    },
    plugins: [
      new HtmlPlugin({ filename: 'index.html', template: 'src/index.html' }),
      new EnvironmentPlugin(['NODE_ENV']),
      new FriendlyErrorsPlugin({ clearConsole: false }),
      new ErrorOverlayPlugin(),
    ],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: require.resolve('source-map-loader'),
          exclude: [],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babel,
            },
            {
              loader: require.resolve('ts-loader'),
              options: {
                onlyCompileBundledFiles: true,
                compilerOptions: {
                  noUnusedLocals: false,
                  noUnusedParameters: false,
                  module: 'ESNext',
                },
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                esModule: false,
                name: 'css/[name].[ext]',
              },
            },
            require.resolve('extract-loader'),
            require.resolve('css-loader'),
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

  webpackConfig.devServer = {
    host: '0.0.0.0',
    port: (process.env.WEBPACK_PORT as any) ?? 4000,
    historyApiFallback: true,
    clientLogLevel: 'silent',
    stats: 'errors-only',
    hot: true,
    inline: true,
    overlay: false,
    noInfo: true,
  };

  return webpackConfig;
}
