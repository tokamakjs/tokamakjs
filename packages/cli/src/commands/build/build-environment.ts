import {
  BabelConfig,
  WebpackConfig,
  createBabelBaseConfig,
  createWebpackBaseConfig,
} from '../../config-files';
import { Environment } from '../../environment';
import { createWebpackBuildConfig } from './create-webpack-build-config';

export class BuildEnvironment extends Environment {
  public createBabelConfig(): BabelConfig {
    const baseConfig = createBabelBaseConfig();
    return this._config.babel(baseConfig);
  }

  public createWebpackConfig(): WebpackConfig {
    const babelConfig = this.createBabelConfig();
    const baseConfig = createWebpackBaseConfig({
      entry: this._packageJson.main,
      babel: babelConfig,
      envVars: this._config.envVars,
      indexTemplate: this._config.indexTemplate,
      publicFolder: this._config.publicFolder,
    });
    const buildConfig = createWebpackBuildConfig(baseConfig);

    return this._config.webpack(buildConfig);
  }
}
