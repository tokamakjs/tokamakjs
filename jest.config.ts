import { pathsToModuleNameMapper } from 'ts-jest';

import { compilerOptions } from './tsconfig.test.json';

export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        babelConfig: 'babel.config.test.json',
        tsconfig: 'tsconfig.test.json',
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
