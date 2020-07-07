import { Command } from 'commander';

async function generateRouteAction(routeName: string): Promise<void> {
  console.log(routeName);
}

export const genRouteCommand = new Command('route')
  .alias('r')
  .description('Creates a new Tokamak route')
  .arguments('<name>')
  .action(generateRouteAction);
