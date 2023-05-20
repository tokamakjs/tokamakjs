const babel = require('@rollup/plugin-babel');
const typescript = require('@rollup/plugin-typescript');
const { defineConfig } = require('rollup');
const nodeResolve = require('@rollup/plugin-node-resolve');

module.exports = defineConfig({
  external: ['reflect-metadata'],
  input: './src/index.ts',
  output: [{ dir: './lib', format: 'esm', sourcemap: true }],
  plugins: [
    nodeResolve(),
    typescript({
      noEmitOnError: true,
      exclude: ['**/__tests__', '**/*.test.ts'],
    }),
    babel({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      babelHelpers: 'runtime',
    }),
  ],
});
