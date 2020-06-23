import { Command } from 'commander';

export const buildCommand = new Command('build')
  .alias('b')
  .description('Builds a tokamak app')
  .action(() => {
    // Set environment to development by default
    process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';

    // Use require() syntax to be able to setup env before requiring
    const { buildAction } = require('./build-action');
    buildAction();
  });
