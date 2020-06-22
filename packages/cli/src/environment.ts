import { BabelConfig } from './babel';
import { WebpackConfig } from './webpack';

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

class MessageConfigurator {
  private _envVars = ['NODE_ENV'];
  private _appName = 'TOKAMAK APP';

  public envVars(vars: Array<string>): void {
    this._envVars = vars;
  }

  public appName(name: string): void {
    this._appName = name;
  }

  public getConfig() {
    return {
      appName: this._appName,
      envVars: this._envVars,
    };
  }
}

export class Environment {
  private _babel = new BabelConfigurator();
  private _webpack = new WebpackConfigurator();
  private _message = new MessageConfigurator();

  get babel() {
    return this._babel;
  }

  get webpack() {
    return this._webpack;
  }

  get message() {
    return this._message;
  }

  public createBabelConfig(config: BabelConfig): BabelConfig {
    return this._babel.getConfig(config);
  }

  public createWebpackConfig(config: WebpackConfig): WebpackConfig {
    return this._webpack.getConfig(config);
  }

  public createMessageConfig(): { appName: string; envVars: Array<string> } {
    return this._message.getConfig();
  }
}
