// Set environment to production
process.env.NODE_ENV = 'production';

import webpack from 'webpack';

import { createBabelConfig } from '../../babel/create-babel-config';
import { Environment } from '../../environment';
import { createBuildConfig } from './webpack.build.config';

export function buildAction(): Promise<void> {
  const appPackageJson = require(`${process.cwd()}/package.json`);
  const { build } = require(`${process.cwd()}/config/build`);

  const environment = new Environment();
  build(environment);

  const finalBabelConfig = environment.createBabelConfig(createBabelConfig());
  const finalWebpackConfig = environment.createWebpackConfig(
    createBuildConfig(appPackageJson.main, finalBabelConfig),
  );

  const compiler = webpack(finalWebpackConfig);

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
