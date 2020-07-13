import path from 'path';

import { BetterProgressPlugin } from '@tokamakjs/dev-utils';
import { Configuration } from 'webpack';

import { BabelConfig } from '../../babel';
import { Environment } from '../../environment';
import { createBaseConfig } from '../../webpack/webpack.base.config';

export function createBuildConfig(
  entry: string,
  babel: BabelConfig,
  environment: Environment,
): Configuration {
  const { envVars } = environment.createMessageConfig();
  const webpackBaseConfig = createBaseConfig(entry, babel, envVars);

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
