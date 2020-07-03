import path from 'path';

import chalk from 'chalk';
import execa from 'execa';
import figures from 'figures';
import fs from 'fs-extra';

import { logLine } from '../../log-line';

const dependencies = [
  '@tokamakjs/cli',
  '@tokamakjs/common',
  '@tokamakjs/core',
  'react',
  'react-dom',
  'modern-normalize',
];

const devDependencies = ['@types/react', '@types/react-dom', 'prettier', 'rimraf', 'typescript'];

async function _checkCanCreate(cwd: string): Promise<boolean> {
  const conflictingFiles = ['package.json'];
  await fs.ensureDir(cwd);
  const files = await fs.readdir(cwd);
  return files.every((f) => !conflictingFiles.includes(f));
}

async function _copyTemplate(cwd: string): Promise<void> {
  const templateDir = path.resolve(__dirname, 'template');
  await fs.copy(templateDir, cwd);
}

async function _install(cwd: string, deps: Array<string>, dev: boolean): Promise<void> {
  await execa(
    'npm',
    ['install', dev ? '--save-dev' : '--save', '--save-exact', '--loglevel', 'error', ...deps],
    { stdio: 'inherit', cwd },
  );
}

export async function newAction(name: string) {
  const outputDir = path.resolve(process.cwd(), name);

  if (!(await _checkCanCreate(outputDir))) {
    logLine(
      chalk.red(
        'The target directory seems to contain a project already. Try using a different name or removing the folder first.',
      ),
    );
    process.exit(1);
  }

  const tick = chalk.green(figures.tick);
  const pointer = chalk.green(figures.pointer);

  logLine(
    pointer,
    chalk.bold(`Creating a new ${chalk.blue('Tokamak')} app in ${chalk.cyan(outputDir)}...`),
  );

  logLine(pointer, chalk.bold('Copying files into destination...'));
  await _copyTemplate(outputDir);

  logLine(pointer, chalk.bold('Installing dependencies...'));
  await _install(outputDir, dependencies, false);

  logLine(pointer, chalk.bold('Installing devDependencies...'));
  await _install(outputDir, devDependencies, true);

  logLine();
  logLine(
    tick,
    chalk.bold(`App created ${chalk.green('succesfully')} in ${chalk.cyan(outputDir)}`),
  );
  logLine();
  logLine(`Inside the newly created directory, you can run:`);
  logLine();
  logLine(`  - ${chalk.yellow('npm start')}`);
  logLine(chalk.grey(`    Starts the app in development mode.`));
  logLine(`  - ${chalk.yellow('npm run build')}`);
  logLine(chalk.grey(`    Builds the app for deployment.`));
  logLine();
  logLine('Example:');
  logLine();
  logLine(chalk.yellow(`  $ cd ${name}`));
  logLine(chalk.yellow('  $ npm start'));
  logLine();
}
