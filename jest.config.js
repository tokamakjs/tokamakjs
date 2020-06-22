module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.js',
      tsConfig: {
        module: 'ESNext',
        noUnusedLocals: process.env.NODE_ENV !== 'development',
        noUnusedParameters: process.env.NODE_ENV !== 'development',
      },
    },
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
