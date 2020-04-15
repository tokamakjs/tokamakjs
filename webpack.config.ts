/// <reference path="./types/better-webpack-progress.d.ts" />

import betterWebpackProgress from 'better-webpack-progress';
import webpack from 'webpack';

import webpackBaseConfig from './webpack.base.config';

webpackBaseConfig.devtool = 'source-map';

webpackBaseConfig.optimization = {
  runtimeChunk: { name: 'runtime' },
  splitChunks: {
    name: 'vendor',
    chunks: 'all',
  },
};

webpackBaseConfig.plugins = [
  ...(webpackBaseConfig.plugins ?? []),
  new webpack.ProgressPlugin(betterWebpackProgress({ mode: 'detailed' })),
];

export default webpackBaseConfig;
