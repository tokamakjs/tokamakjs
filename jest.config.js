module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.js',
      tsConfig: { module: 'ESNext' },
    },
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
