import { Configuration as WebpackConfig } from 'webpack';

export interface BabelConfig {
  presets?: Array<any>;
  plugins?: Array<any>;
}

export { WebpackConfig };

abstract class Configurator<T> {
  protected _configurator?: (config: T) => T;

  public abstract config(configurator: (config: T) => T): void;

  public getConfig(config: T): T {
    if (this._configurator == null) {
      return config;
    }

    return this._configurator(config);
  }
}

class BabelConfigurator extends Configurator<BabelConfig> {
  public config(configurator: (config: BabelConfig) => BabelConfig): void {
    this._configurator = configurator;
  }
}

class WebpackConfigurator extends Configurator<WebpackConfig> {
  public config(configurator: (config: WebpackConfig) => WebpackConfig): void {
    this._configurator = configurator;
  }
}

export class Environment {
  private _babel = new BabelConfigurator();
  private _webpack = new WebpackConfigurator();

  get babel() {
    return this._babel;
  }

  get webpack() {
    return this._webpack;
  }

  public createBabelConfig(config: BabelConfig): BabelConfig {
    return this._babel.getConfig(config);
  }

  public createWebpackConfig(config: WebpackConfig): WebpackConfig {
    return this._webpack.getConfig(config);
  }
}
