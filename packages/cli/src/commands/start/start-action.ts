import dotenv from 'dotenv';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { createBabelConfig } from '../../babel/create-babel-config';
import { Environment } from '../../environment';
import { createWebpackConfig } from '../../webpack';

dotenv.config();

export async function startAction(): Promise<void> {
  const appPackageJson = require(`${process.cwd()}/package.json`);
  const { development } = require(`${process.cwd()}/config/development`);

  const environment = new Environment();
  development(environment);

  const finalBabelConfig = environment.createBabelConfig(createBabelConfig());
  const finalWebpackConfig = environment.createWebpackConfig(
    createWebpackConfig('start', appPackageJson.main, finalBabelConfig),
  );

  const compiler = webpack(finalWebpackConfig);
  const devServer = new WebpackDevServer(compiler, finalWebpackConfig.devServer);

  devServer.listen(finalWebpackConfig.devServer!.port!);
}
