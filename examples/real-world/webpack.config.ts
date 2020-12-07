import path from 'path';

// @ts-ignore
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';

const config: Configuration = {
  mode: 'development',
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx'],
    symlinks: false,
    plugins: [new TsconfigPathsPlugin()],
    modules: ['node_modules', 'vendor'],
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlPlugin({ filename: 'index.html', template: 'public/index.html' }),
    new EnvironmentPlugin(['NODE_ENV']),
    new ReactRefreshWebpackPlugin({ disableRefreshCheck: true, overlay: false }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
              compilerOptions: {
                noUnusedLocals: false,
                noUnusedParameters: false,
                module: 'ESNext',
              },
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        // These packages don't provide their source
        exclude: [/react-mapbox-wrapper/, /urql-computed-exchange/, /use-filters/],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
              name: 'css/[name].[ext]',
            },
          },
          'extract-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'images/[name].[ext]',
          },
        },
      },
    ],
  },
};

// @ts-ignore
config.devServer = {
  host: '0.0.0.0',
  port: 8080,
  historyApiFallback: true,
  hot: true,
  inline: true,
};

export default config;
