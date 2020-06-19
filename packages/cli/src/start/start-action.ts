import dotenv from 'dotenv';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import babelConfig from './babel.config';
import { Environment } from './environment';
import { createConfig } from './webpack.config';

dotenv.config();

export async function startAction(): Promise<void> {
  const appPackageJson = require(`${process.cwd()}/package.json`);
  const { development } = require(`${process.cwd()}/config/development`);

  const environment = new Environment();
  development(environment);

  const finalBabelConfig = environment.createBabelConfig(babelConfig);
  const finalWebpackConfig = environment.createWebpackConfig(
    createConfig(appPackageJson.main, finalBabelConfig),
  );

  const compiler = webpack(finalWebpackConfig);
  const devServer = new WebpackDevServer(compiler);

  devServer.listen(4000);
}
