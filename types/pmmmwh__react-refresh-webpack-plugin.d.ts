declare module '@pmmmwh/react-refresh-webpack-plugin' {
  import { Plugin } from 'webpack';

  interface ReactRefreshWebpackPluginOptions {
    disableRefreshCheck?: boolean;
    forceEnable?: boolean;
    useLegacyWDSSockets?: boolean;
    overlay?: boolean;
  }

  class ReactRefreshWebpackPlugin extends Plugin {
    constructor(options: ReactRefreshWebpackPluginOptions);
  }

  export = ReactRefreshWebpackPlugin;
}
