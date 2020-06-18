import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { createConfig } from './webpack.config';

export async function startAction(): Promise<void> {
  const appPackageJson = require(`${process.cwd()}/package.json`);

  const webpackConfig = createConfig(appPackageJson.main);
  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler);

  devServer.listen(4000);
}
