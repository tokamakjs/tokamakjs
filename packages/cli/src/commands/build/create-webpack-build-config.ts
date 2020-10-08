import path from 'path';

import { BetterProgressPlugin } from '@tokamakjs/dev-utils';
import { Configuration } from 'webpack';

import { WebpackConfig } from '../../config-files';

export function createWebpackBuildConfig(baseConfig: WebpackConfig): Configuration {
  baseConfig.devtool = 'source-map';

  baseConfig.optimization = {
    runtimeChunk: { name: 'runtime' },
    splitChunks: { name: 'vendor', chunks: 'all' },
  };

  baseConfig.output!.path = path.resolve(process.cwd(), 'dist');

  baseConfig.plugins = [
    ...(baseConfig.plugins ?? []),
    new BetterProgressPlugin({ mode: 'detailed' }),
  ];

  return baseConfig;
}
