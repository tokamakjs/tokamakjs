import path from 'path';

import { Configuration } from 'webpack';

import { BabelConfig } from '../../babel';
import { createBaseConfig } from '../../webpack/webpack.base.config';

export function createBuildConfig(entry: string, babel: BabelConfig): Configuration {
  const webpackBaseConfig = createBaseConfig(entry, babel);

  webpackBaseConfig.devtool = 'source-map';

  webpackBaseConfig.optimization = {
    runtimeChunk: { name: 'runtime' },
    splitChunks: { name: 'vendor', chunks: 'all' },
  };

  webpackBaseConfig.output!.path = path.resolve(process.cwd(), 'dist');

  webpackBaseConfig.plugins = [...(webpackBaseConfig.plugins ?? [])];

  return webpackBaseConfig;
}
