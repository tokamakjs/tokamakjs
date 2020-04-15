declare module 'better-webpack-progress' {
  type ProgressCallback = (
    percentage: number,
    msg: string,
    moduleProgress?: string,
    activeModules?: string,
    moduleName?: string,
  ) => void;

  interface BetterWebpackProgressOptions {
    mode: 'bar' | 'detailed' | 'compact';
    customSummary?: () => void;
  }

  function betterWebpackProgress(options: BetterWebpackProgressOptions): ProgressCallback;

  export = betterWebpackProgress;
}
