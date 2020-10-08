import { defaults } from 'lodash';

import {
  BabelConfig,
  WebpackConfig,
  createBabelBaseConfig,
  createWebpackBaseConfig,
} from './config-files';

export interface EnvironmentConfig {
  appName?: string;
  envVars?: Array<string>;
  indexTemplate?: string;
  publicFolder?: string;
  webpackPort?: number;
  webpack?: (config: WebpackConfig) => WebpackConfig;
  babel?: (config: BabelConfig) => BabelConfig;
}

export class Environment {
  private readonly _config: Required<EnvironmentConfig>;

  constructor(_config: EnvironmentConfig, private readonly _packageJson: Record<string, any>) {
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

  get appName() {
    return this._config.appName;
  }

  get envVars() {
    return this._config.envVars;
  }

  get indexTemplate() {
    return this._config.indexTemplate;
  }

  get publicFolder() {
    return this._config.publicFolder;
  }

  get webpackPort() {
    return this._config.webpackPort;
  }

  get babelConfig() {
    const baseConfig = createBabelBaseConfig();
    return typeof this._config.babel === 'function' ? this._config.babel(baseConfig) : baseConfig;
  }

  get webpackConfig() {
    const baseConfig = createWebpackBaseConfig({
      entry: this._packageJson.main,
      babel: this.babelConfig,
      envVars: this.envVars,
      indexTemplate: this.indexTemplate,
    });

    return typeof this._config.webpack === 'function'
      ? this._config.webpack(baseConfig)
      : baseConfig;
  }
}
