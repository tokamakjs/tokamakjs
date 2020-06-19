export interface BabelConfig {
  presets?: Array<any>;
  plugins?: Array<any>;
}

export function createBabelConfig(): BabelConfig {
  const babelConfig: BabelConfig = {
    presets: [
      ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }],
      '@babel/preset-react',
    ],
  };

  return babelConfig;
}
