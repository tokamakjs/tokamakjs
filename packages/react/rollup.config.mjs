import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';

export default defineConfig({
  external: [
    '@tokamakjs/common',
    '@tokamakjs/injection',
    'react-dom',
    'react-router-dom',
    'react-router',
    'react',
    'reflect-metadata',
    'url-join',
  ],
  input: './src/index.ts',
  output: { dir: 'lib', format: 'esm', sourcemap: true },
  plugins: [
    typescript({
      noEmitOnError: true,
    }),
    babel({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      babelHelpers: 'runtime',
    }),
  ],
});
