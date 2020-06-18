import { Command } from 'commander';

export async function main() {
  // console.log('START COMMAND');
}

export const startCommand = new Command('start')
  .alias('s')
  .description('Starts a tokamak app')
  .action(main);
