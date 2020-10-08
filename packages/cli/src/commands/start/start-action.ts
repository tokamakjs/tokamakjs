import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { Environment, EnvironmentConfig } from '../../environment';
import { createStartConfig } from './webpack.start.config';

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

  const config = start() as EnvironmentConfig;
  const environment = new Environment(config, appPackageJson);

  const webpackConfig = createStartConfig(environment);

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);

  devServer.listen(webpackConfig.devServer!.port!);
}
