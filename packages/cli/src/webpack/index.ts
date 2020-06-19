import { Configuration } from 'webpack';

import { BabelConfig } from '../babel';
import { createBuildConfig } from './webpack.build.config';
import { createStartConfig } from './webpack.start.config';

export { Configuration as WebpackConfig };

export function createWebpackConfig(
  mode: 'start' | 'build',
  entry: string,
  babel: BabelConfig,
): Configuration {
  if (mode === 'start') {
    return createStartConfig(entry, babel);
  } else {
    return createBuildConfig(entry, babel);
  }
}
