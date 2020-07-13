/// <reference path="../../../types/error-overlay-webpack-plugin.d.ts" />

import { BetterProgressPlugin, initialAppMessage } from '@tokamakjs/dev-utils';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { Configuration } from 'webpack';

import { BabelConfig } from '../../babel';
import { Environment } from '../../environment';
import { createBaseConfig } from '../../webpack/webpack.base.config';

export function createStartConfig(
  entry: string,
  babel: BabelConfig,
  environment: Environment,
): Configuration {
  const { appName, envVars } = environment.createMessageConfig();
  const webpackBaseConfig = createBaseConfig(entry, babel, envVars);

  webpackBaseConfig.devtool = 'cheap-module-source-map';

  webpackBaseConfig.optimization = {
    noEmitOnErrors: true,
  };

  const port = process.env.WEBPACK_PORT ?? 4000;

  webpackBaseConfig.plugins = [
    ...(webpackBaseConfig.plugins ?? []),
    new BetterProgressPlugin({
      mode: 'bar',
      summary: () => process.stdout.write(initialAppMessage(appName, port, envVars)),
    }),
    new FriendlyErrorsPlugin({ clearConsole: false }),
    new ErrorOverlayPlugin(),
  ];

  webpackBaseConfig.devServer = {
    host: '0.0.0.0',
    port: port as number,
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
