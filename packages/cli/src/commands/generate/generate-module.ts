import path from 'path';

import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import camelCase from 'lodash/camelCase';

import { fileExists, findProjectRoot, logLine } from '../../utils';

function _getClassName(moduleName: string): string {
  return moduleName[0].toUpperCase() + camelCase(moduleName).slice(1);
}

async function generateModuleAction(name: string): Promise<void> {
  const projectRoot = await findProjectRoot();
  const moduleFolder = path.join(projectRoot, 'src/app/modules', name);
  const moduleName = name.split('/').slice(-1)[0];
  await fs.ensureDir(moduleFolder);
  const newModuleFile = path.join(moduleFolder, `${moduleName}.module.ts`);

  if (await fileExists(newModuleFile)) {
    logLine(chalk.red(`The new module conflicts with an existing file.`));
    process.exit(1);
  }

  const newModuleData = `import { module } from '@tokamakjs/core';

@module({})
export class ${_getClassName(moduleName)}Module {}
`;

  await fs.writeFile(newModuleFile, newModuleData, 'utf-8');
}

export const genModuleCommand = new Command('module')
  .alias('m')
  .description('Creates a new Tokamak module')
  .arguments('<name>')
  .action(generateModuleAction);
