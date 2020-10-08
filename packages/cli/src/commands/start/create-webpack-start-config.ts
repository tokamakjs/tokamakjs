/// <reference path="../../../types/error-overlay-webpack-plugin.d.ts" />

import { BetterProgressPlugin, initialAppMessage } from '@tokamakjs/dev-utils';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { Configuration } from 'webpack';

import { WebpackConfig } from '../../config-files';

export function createWebpackStartConfig(
  baseConfig: WebpackConfig,
  { appName, envVars, port }: { appName: string; envVars: Array<string>; port: number },
): Configuration {
  baseConfig.devtool = 'cheap-module-source-map';

  baseConfig.optimization = {
    noEmitOnErrors: true,
  };

  baseConfig.plugins = [
    ...(baseConfig.plugins ?? []),
    new BetterProgressPlugin({
      mode: 'bar',
      summary: () => process.stdout.write(initialAppMessage(appName, port, envVars)),
    }),
    new FriendlyErrorsPlugin({ clearConsole: false }),
    new ErrorOverlayPlugin(),
  ];

  baseConfig.devServer = {
    host: '0.0.0.0',
    port,
    historyApiFallback: true,
    clientLogLevel: 'silent',
    stats: 'errors-only',
    hot: true,
    inline: true,
    overlay: false,
    noInfo: true,
  };

  return baseConfig;
}
