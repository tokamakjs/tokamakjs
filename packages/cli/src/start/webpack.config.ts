import HtmlPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';

import { BabelConfig } from './environment';

export function createConfig(entry: string, babel?: BabelConfig): Configuration {
  const webpackConfig: Configuration = {
    mode: 'development',
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.tsx'],
      plugins: [new TsconfigPathsPlugin()],
      symlinks: false,
    },
    entry: { app: entry.startsWith('./') ? entry : `./${entry}` },
    plugins: [
      new HtmlPlugin({ filename: 'index.html', template: 'src/index.html' }),
      new EnvironmentPlugin(['NODE_ENV']),
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
      ],
    },
  };

  webpackConfig.devServer = {};

  return webpackConfig;
}
