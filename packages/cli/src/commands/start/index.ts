import { Command } from 'commander';

import { startAction } from './start-action';

export const startCommand = new Command('start')
  .alias('s')
  .description('Starts a tokamak app')
  .action(startAction);
