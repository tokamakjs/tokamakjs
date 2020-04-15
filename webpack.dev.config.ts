/// <reference path="./types/better-webpack-progress.d.ts" />
/// <reference path="./types/error-overlay-webpack-plugin.d.ts" />
/// <reference path="./types/initial-app-message.d.ts" />
/// <reference path="./types/pmmmwh__react-refresh-webpack-plugin.d.ts" />

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ansiEscapes from 'ansi-escapes';
import betterWebpackProgress from 'better-webpack-progress';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import initialMessage from 'initial-app-message';
import { UnusedFilesWebpackPlugin } from 'unused-files-webpack-plugin';
import webpack from 'webpack';

import { RemoveReactRefreshOverlayWebpackPlugin } from './vendor/remove-react-refresh-overlay-webpack-plugin';
import webpackBaseConfig from './webpack.base.config';

webpackBaseConfig.devtool = 'cheap-module-source-map';

webpackBaseConfig.optimization = {
  noEmitOnErrors: true,
};

webpackBaseConfig.plugins = [
  ...(webpackBaseConfig.plugins ?? []),
  new webpack.ProgressPlugin(
    betterWebpackProgress({
      mode: 'bar',
      customSummary: () => {
        process.stdout.write(ansiEscapes.clearScreen);
        process.stdout.write(
          initialMessage('Drawbotics Software', process.env.WEBPACK_PORT!, [
            'APP_ENV',
            'AUTH_HOST',
          ]).join('\n'),
        );
      },
    }),
  ),
  new FriendlyErrorsPlugin({ clearConsole: false }),
  new ErrorOverlayPlugin(),
  new UnusedFilesWebpackPlugin({
    failOnUnused: false,
    patterns: ['app/**/*.ts', 'app/**/*.tsx'],
    globOptions: { ignore: ['node_modules/**/*', '**/__tests__/**/*', '**/__mocks__/**/*'] },
  }),
  new ReactRefreshWebpackPlugin({ disableRefreshCheck: true, overlay: false }),
  new RemoveReactRefreshOverlayWebpackPlugin(),
];

webpackBaseConfig.devServer = {
  host: '0.0.0.0',
  port: process.env.WEBPACK_PORT as any,
  historyApiFallback: true,
  clientLogLevel: 'silent',
  stats: 'errors-only',
  hot: true,
  inline: true,
  overlay: false,
  noInfo: true,
};

export default webpackBaseConfig;
