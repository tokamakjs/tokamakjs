import chalk from 'chalk';
import ip from 'ip';

import { createBox } from './box';

const WIDTH = 70;

function _environment(envVars: Array<string>): Array<string> {
  const { cyan } = chalk;
  return envVars.map((envVar) => {
    return ` - ${cyan(`${envVar}:`)} ${process.env[envVar] ?? 'undefined'}`;
  });
}

export function initialAppMessage(
  title: string,
  port: number | string,
  envVars: Array<string> = [],
): string {
  const { green, bold, cyan } = chalk;
  const lines = [];

  if (!envVars.includes('NODE_ENV')) {
    envVars.unshift('NODE_ENV');
  }

  lines.push(bold('The app is running at:'));
  lines.push('');
  lines.push(` - ${cyan('Local:')} http://localhost:${port}`);
  lines.push(` - ${cyan('Network:')} http://${ip.address()}:${port}`);
  lines.push('');
  lines.push(bold('Environment:'));
  lines.push(..._environment(envVars));

  return createBox(WIDTH, {
    header: green.bold(title ?? 'TOKAMAK APP'),
    content: lines,
  }).join('\n');
}
