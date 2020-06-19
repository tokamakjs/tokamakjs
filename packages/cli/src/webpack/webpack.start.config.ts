/// <reference path="../../types/error-overlay-webpack-plugin.d.ts" />

import { BetterProgressPlugin } from '@tokamakjs/dev-utils';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin';
import { Configuration } from 'webpack';

import { BabelConfig } from '../babel';
import { createBaseConfig } from './webpack.base.config';

export function createStartConfig(entry: string, babel: BabelConfig): Configuration {
  const webpackBaseConfig = createBaseConfig(entry, babel);

  webpackBaseConfig.devtool = 'cheap-module-source-map';

  webpackBaseConfig.optimization = {
    noEmitOnErrors: true,
  };

  webpackBaseConfig.plugins = [
    ...(webpackBaseConfig.plugins ?? []),
    new FriendlyErrorsPlugin({ clearConsole: false }),
    new ErrorOverlayPlugin(),
    new BetterProgressPlugin({
      mode: 'bar',
      summary: () => {
        console.log('Hello');
      },
    }),
  ];

  webpackBaseConfig.devServer = {
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

  return webpackBaseConfig;
}
