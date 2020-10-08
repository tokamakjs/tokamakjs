import path from 'path';

import { EnvironmentConfig } from '@tokamakjs/cli';

export function build(): EnvironmentConfig {
  return {
    appName: 'REAL WORLD EXAMPLE',
    envVars: ['NODE_ENV', 'APP_ENV'],
    indexTemplate: path.resolve(__dirname, '../public/index.html'),
    publicFolder: path.resolve(__dirname, '../public'),
  };
}
