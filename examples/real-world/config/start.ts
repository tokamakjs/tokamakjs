import path from 'path';

import { BabelConfig, EnvironmentConfig, WebpackConfig } from '@tokamakjs/cli';

export function start(): EnvironmentConfig {
  return {
    appName: 'REAL WORLD EXAMPLE',
    envVars: ['NODE_ENV', 'APP_ENV'],
    indexTemplate: path.resolve(__dirname, '../public/index.html'),
    publicFolder: path.resolve(__dirname, '../public'),
    webpack: (config: WebpackConfig) => config,
    babel: (config: BabelConfig) => config,
  };
}
