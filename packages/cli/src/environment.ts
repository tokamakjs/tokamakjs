import { defaults } from 'lodash';

import { BabelConfig, WebpackConfig } from './config-files';

export interface EnvironmentConfig {
  appName?: string;
  envVars?: Array<string>;
  indexTemplate?: string;
  publicFolder?: string;
  webpackPort?: number;
  webpack?: (config: WebpackConfig) => WebpackConfig;
  babel?: (config: BabelConfig) => BabelConfig;
}

export abstract class Environment {
  protected readonly _config: Required<EnvironmentConfig>;

  constructor(_config: EnvironmentConfig, protected readonly _packageJson: Record<string, any>) {
    this._config = defaults(_config, {
      appName: 'TOKAMAK APP',
      envVars: ['NODE_ENV', 'APP_ENV'],
      indexTemplate: './public/index.html',
      publicFolder: './public',
      webpackPort: 4000,
      webpack: (config: WebpackConfig) => config,
      babel: (config: BabelConfig) => config,
    });
  }

  abstract createBabelConfig(): BabelConfig;
  abstract createWebpackConfig(): WebpackConfig;
}
