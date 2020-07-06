import path from 'path';

import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import camelCase from 'lodash/camelCase';

import { logLine } from '../../log-line';

function _fileExists(filename: string): Promise<boolean> {
  return new Promise((r) => {
    fs.access(filename, fs.constants.F_OK, (err: any) => {
      return err == null ? r(true) : r(false);
    });
  });
}

async function _findProjectRoot(cwd = process.cwd()): Promise<string> {
  // Right now, we assume project root contains a package.json,
  // a folder named config and another one named src. Maybe in the
  // future we'll have a project config file we can rely on.
  const currentFiles = await fs.readdir(cwd);
  if (
    currentFiles.includes('config') &&
    currentFiles.includes('src') &&
    currentFiles.includes('package.json')
  ) {
    return cwd;
  } else {
    return _findProjectRoot(path.resolve(cwd, '../'));
  }
}

function _getClassName(moduleName: string): string {
  return moduleName[0].toUpperCase() + camelCase(moduleName).slice(1);
}

async function generateModuleAction(name: string): Promise<void> {
  const projectRoot = await _findProjectRoot();
  const moduleFolder = path.join(projectRoot, 'src', 'app', name);
  const moduleName = name.split('/').slice(-1)[0];
  await fs.ensureDir(moduleFolder);
  const newModuleFile = path.join(moduleFolder, `${moduleName}.module.ts`);

  if (await _fileExists(newModuleFile)) {
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
