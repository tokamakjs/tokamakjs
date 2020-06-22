import { Command } from 'commander';

export const generateCommand = new Command('generate')
  .alias('g')
  .description('Creates a new tokamak app component');
