import path from 'path';

import { BetterProgressPlugin } from '@tokamakjs/dev-utils';
import { Configuration } from 'webpack';

import { Environment } from '../../environment';

export function createWebpackBuildConfig(env: Environment): Configuration {
  const { webpackConfig: webpackBaseConfig } = env;

  webpackBaseConfig.devtool = 'source-map';

  webpackBaseConfig.optimization = {
    runtimeChunk: { name: 'runtime' },
    splitChunks: { name: 'vendor', chunks: 'all' },
  };

  webpackBaseConfig.output!.path = path.resolve(process.cwd(), 'dist');

  webpackBaseConfig.plugins = [
    ...(webpackBaseConfig.plugins ?? []),
    new BetterProgressPlugin({ mode: 'detailed' }),
  ];

  return webpackBaseConfig;
}
