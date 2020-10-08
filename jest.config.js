module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.json',
      tsConfig: 'tsconfig.test.json',
    },
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
