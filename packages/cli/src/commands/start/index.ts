import { Command } from 'commander';

export const startCommand = new Command('start')
  .alias('s')
  .description('Starts a tokamak app')
  .action(() => {
    // Set environment to development by default
    process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';

    // Use require() syntax to be able to setup env before requiring
    const { startAction } = require('./start-action');
    startAction();
  });
