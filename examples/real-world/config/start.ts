import { BabelConfig, Environment, WebpackConfig } from '@tokamakjs/cli';

export function start(environment: Environment) {
  environment.webpack.config((config: WebpackConfig) => {
    return config;
  });

  environment.babel.config((config: BabelConfig) => {
    return config;
  });

  environment.message.envVars(['NODE_ENV', 'APP_ENV']);

  environment.message.appName('REAL WORLD');
}
