import { Command } from 'commander';

import { newAction } from './new-action';

export const newCommand = new Command('new')
  .alias('n')
  .description('Creates a new tokamak app')
  .arguments('<name>')
  .action(newAction);
