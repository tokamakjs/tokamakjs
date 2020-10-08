export interface BabelConfig {
  presets?: Array<any>;
  plugins?: Array<any>;
}

export function createBabelBaseConfig(): BabelConfig {
  const babelConfig: BabelConfig = {
    presets: [
      ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 }, modules: false }],
      '@babel/preset-react',
    ],
  };

  return babelConfig;
}
