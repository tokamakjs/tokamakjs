const path = require('path');

const typescript = require('@rollup/plugin-typescript');
const { getBabelOutputPlugin: babel } = require('@rollup/plugin-babel');

module.exports = [
  {
    external: ['reflect-metadata'],
    input: './src/index.ts',
    output: { dir: 'lib', format: 'esm', sourcemap: true },
    plugins: [
      typescript({ noEmitOnError: true }),
      babel({ configFile: path.resolve(__dirname, 'babel.config.json') }),
    ],
  },
];
