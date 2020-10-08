import webpack from 'webpack';

import { Environment, EnvironmentConfig } from '../../environment';
import { createWebpackBuildConfig } from './webpack.build.config';

export function buildAction(): Promise<void> {
  require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });

  const cwd = process.cwd();
  const appPackageJson = require(`${cwd}/package.json`);
  const { build } = require(`${cwd}/config/build`);

  const config = build() as EnvironmentConfig;
  const environment = new Environment(config, appPackageJson);

  const webpackConfig = createWebpackBuildConfig(environment);

  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        console.error(stats.compilation.errors);
        reject();
      } else {
        resolve();
      }
    });
  });
}
