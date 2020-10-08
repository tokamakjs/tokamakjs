import CopyPlugin from 'copy-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';

import { BabelConfig } from './babel-config';

export { Configuration as WebpackConfig } from 'webpack';

export function createWebpackBaseConfig({
  entry,
  babel,
  envVars,
  indexTemplate,
  publicFolder,
}: {
  entry: string;
  babel: BabelConfig;
  envVars: Array<string>;
  indexTemplate: string;
  publicFolder: string | undefined;
}): Configuration {
  const baseConfig = {
    mode: 'development',
    optimization: {
      noEmitOnErrors: true,
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx'],
      plugins: [new TsconfigPathsPlugin()],
      symlinks: false,
    },
    entry: { app: entry.startsWith('./') ? entry : `./${entry}` },
    output: {
      filename: 'js/[name].js',
      publicPath: '/',
    },
    plugins: [
      new HtmlPlugin({ filename: 'index.html', template: indexTemplate }),
      new EnvironmentPlugin(envVars),
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
                context: process.cwd(),
                compilerOptions: {
                  noUnusedLocals: false,
                  noUnusedParameters: false,
                  module: 'ESNext',
                  declaration: false,
                },
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: babel,
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
  } as Configuration;

  if (publicFolder != null) {
    baseConfig.plugins?.push(
      new CopyPlugin({ patterns: [{ context: publicFolder, from: '**/*' }] }),
    );
  }

  return baseConfig;
}
