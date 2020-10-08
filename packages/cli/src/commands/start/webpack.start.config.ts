/// <reference path="../../../types/error-overlay-webpack-plugin.d.ts" />

import { BetterProgressPlugin, initialAppMessage } from '@tokamakjs/dev-utils';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { Configuration } from 'webpack';

import { Environment } from '../../environment';

export function createStartConfig(env: Environment): Configuration {
  const { webpackConfig: webpackBaseConfig, webpackPort, appName, envVars } = env;

  webpackBaseConfig.devtool = 'cheap-module-source-map';

  webpackBaseConfig.optimization = {
    noEmitOnErrors: true,
  };

  webpackBaseConfig.plugins = [
    ...(webpackBaseConfig.plugins ?? []),
    new BetterProgressPlugin({
      mode: 'bar',
      summary: () => process.stdout.write(initialAppMessage(appName, webpackPort, envVars)),
    }),
    new FriendlyErrorsPlugin({ clearConsole: false }),
    new ErrorOverlayPlugin(),
  ];

  webpackBaseConfig.devServer = {
    host: '0.0.0.0',
    port: webpackPort,
    historyApiFallback: true,
    clientLogLevel: 'silent',
    stats: 'errors-only',
    hot: true,
    inline: true,
    overlay: false,
    noInfo: true,
  };

  return webpackBaseConfig;
}
