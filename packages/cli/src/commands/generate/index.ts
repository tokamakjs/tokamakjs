import { Command } from 'commander';

import { genModuleCommand } from './generate-module';

export const generateCommand = new Command('generate')
  .alias('g')
  .description('Creates a new Tokamak app component')
  .addHelpCommand(false)
  .addCommand(genModuleCommand);
