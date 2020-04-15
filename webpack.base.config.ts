import path from 'path';

import { checkEnv } from '@drawbotics/check-env';
import dotenv from 'dotenv';
import HtmlPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';

dotenv.config();

checkEnv(['NODE_ENV', 'APP_ENV', 'WEBPACK_PORT']);

const IS_DEV = process.env.NODE_ENV === 'development';

const baseConfig: Configuration = {
  mode: process.env.NODE_ENV as any,
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    symlinks: false,
    plugins: [new TsconfigPathsPlugin()],
    modules: ['node_modules', 'vendor'],
  },
  entry: { app: ['./app/index.ts'] },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlPlugin({ filename: 'index.html', template: 'public/index.html' }),
    new EnvironmentPlugin(['NODE_ENV', 'APP_ENV', 'AUTH_HOST']),
    new InterpolateHtmlPlugin(HtmlPlugin, { PUBLIC_URL: '' }),
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
                noUnusedLocals: !IS_DEV,
                noUnusedParameters: !IS_DEV,
                module: 'ESNext',
              },
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: /react-mapbox-wrapper/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: IS_DEV ? 'css/[name].[ext]' : 'css/[contenthash].[ext]',
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
            name: IS_DEV ? 'images/[name].[ext]' : 'images/[contenthash].[ext]',
          },
        },
      },
    ],
  },
};

export default baseConfig;
