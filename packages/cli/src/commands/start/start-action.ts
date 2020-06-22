import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { createBabelConfig } from '../../babel/create-babel-config';
import { Environment } from '../../environment';
import { createStartConfig } from './webpack.start.config';

export async function startAction(): Promise<void> {
  const appPackageJson = require(`${process.cwd()}/package.json`);
  const { start } = require(`${process.cwd()}/config/start`);

  const environment = new Environment();
  start(environment);

  const finalBabelConfig = environment.createBabelConfig(createBabelConfig());
  const finalWebpackConfig = environment.createWebpackConfig(
    createStartConfig(appPackageJson.main, finalBabelConfig, environment),
  );

  const compiler = webpack(finalWebpackConfig);
  const devServer = new WebpackDevServer(compiler, finalWebpackConfig.devServer);

  devServer.listen(finalWebpackConfig.devServer!.port!);
}
