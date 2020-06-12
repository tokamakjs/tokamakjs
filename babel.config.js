const IS_DEV = process.env.NODE_ENV === 'development';

const presets = [
  ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }],
  '@babel/preset-react',
];

const plugins = [];

module.exports = { presets, plugins };
