import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { EnvironmentConfig } from '../../environment';
import { StartEnvironment } from './start-environment';

export async function startAction(): Promise<void> {
  require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs',
    },
  });

  const cwd = process.cwd();
  const appPackageJson = require(`${cwd}/package.json`);
  const { start } = require(`${cwd}/config/start`);

  const envConfig = start() as EnvironmentConfig;
  const environment = new StartEnvironment(envConfig, appPackageJson);
  const webpackConfig = environment.createWebpackConfig();

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);

  devServer.listen(webpackConfig.devServer!.port!);
}
