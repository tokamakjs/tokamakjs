// @ts-nocheck

export function development(environment: Environment) {
  environment.webpack.config((config: WebpackConfig) => {
    return config;
  });

  environment.babel.config((config: BabelConfig) => {
    return config;
  });
}
