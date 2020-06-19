import { Configuration } from 'webpack';

import { BabelConfig } from '../babel';
import { Environment } from '../environment';
import { createBuildConfig } from './webpack.build.config';
import { createStartConfig } from './webpack.start.config';

export { Configuration as WebpackConfig };

export function createWebpackConfig(
  mode: 'start' | 'build',
  entry: string,
  babel: BabelConfig,
  environment: Environment,
): Configuration {
  if (mode === 'start') {
    return createStartConfig(entry, babel, environment);
  } else {
    return createBuildConfig(entry, babel);
  }
}
