import { Command } from 'commander';

import { buildAction } from './build-action';

export const buildCommand = new Command('build')
  .alias('b')
  .description('Builds a tokamak app')
  .action(buildAction);
