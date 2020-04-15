const IS_DEV = process.env.NODE_ENV === 'development';

const presets = [
  ['@babel/preset-env', { useBuiltIns: 'usage', corejs: { version: 3 } }],
  '@babel/preset-react',
];

const plugins = [
  ['emotion', { sourceMap: true, autoLabel: true, labelFormat: '[filename]__[local]' }],
];

if (IS_DEV) {
  plugins.push('react-refresh/babel.js');
}

module.exports = { presets, plugins };
