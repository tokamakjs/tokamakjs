import {
  BabelConfig,
  WebpackConfig,
  createBabelBaseConfig,
  createWebpackBaseConfig,
} from '../../config-files';
import { Environment } from '../../environment';
import { createWebpackStartConfig } from './create-webpack-start-config';

export class StartEnvironment extends Environment {
  createBabelConfig(): BabelConfig {
    const baseConfig = createBabelBaseConfig();
    return this._config.babel(baseConfig);
  }

  createWebpackConfig(): WebpackConfig {
    const babelConfig = this.createBabelConfig();
    const baseConfig = createWebpackBaseConfig({
      entry: this._packageJson.main,
      babel: babelConfig,
      envVars: this._config.envVars,
      indexTemplate: this._config.indexTemplate,
      publicFolder: this._config.publicFolder,
    });
    const startConfig = createWebpackStartConfig(baseConfig, {
      appName: this._config.appName,
      envVars: this._config.envVars,
      port: this._config.webpackPort,
    });

    return this._config.webpack(startConfig);
  }
}
