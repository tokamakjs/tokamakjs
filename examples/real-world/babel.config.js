const presets = [
  ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }],
  '@babel/preset-react',
];

const plugins = ['react-refresh/babel.js'];

module.exports = { presets, plugins };
