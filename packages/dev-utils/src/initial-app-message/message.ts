import c from 'chalk';
import ip from 'ip';

import { createBox } from './box';

const WIDTH = 70;

function _environment(envVars: Array<string>): Array<string> {
  return envVars.map((envVar) => {
    return ` - ${c.cyan(`${envVar}:`)} ${process.env[envVar] ?? 'undefined'}`;
  });
}

export function initialAppMessage(
  title: string,
  port: number | string,
  envVars: Array<string> = [],
): string {
  const lines = [];

  if (!envVars.includes('NODE_ENV')) {
    envVars.unshift('NODE_ENV');
  }

  lines.push(c.bold('The app is running at:'));
  lines.push('');
  lines.push(` - ${c.cyan('Local:')} http://localhost:${port}`);
  lines.push(` - ${c.cyan('Network:')} http://${ip.address()}:${port}`);
  lines.push('');
  lines.push(c.bold('Environment:'));
  lines.push(..._environment(envVars));

  return createBox(WIDTH, {
    header: c.green.bold(title ?? 'TOKAMAK APP'),
    content: lines,
  }).join('\n');
}
