import path from 'path';

import execa from 'execa';
import figures from 'figures';
import fs from 'fs-extra';
import ora from 'ora';

const TEMPLATE_DIR = path.resolve(__dirname, 'template');

const dependencies = ['@tokamak/cli', '@tokamak/common', '@tokamak/core', 'react', 'react-dom'];
const devDependencies = ['@types/react', '@types/react-dom', 'prettier', 'rimraf', 'typescript'];

async function _install(cwd: string, deps: Array<string>, dev: boolean) {
  await execa(
    'npm',
    ['install', dev ? '--save-dev' : '--save', '--save-exact', '--log-level', 'error', ...deps],
    {
      stdin: 'inherit',
      stdio: 'inherit',
      stderr: 'inherit',
      stdout: 'inherit',
      cwd,
    },
  );
}

export async function newAction(name: string) {
  const outputDir = path.resolve(process.cwd(), name);

  const spinner = ora();

  spinner.start('Copying files into destination...');
  await fs.copy(TEMPLATE_DIR, outputDir);
  spinner.stopAndPersist({
    text: 'Finished copying files into destination.',
    symbol: figures.tick,
  });

  process.stdout.write('Installing dependencies...\n');
  await _install(outputDir, dependencies, false);
  process.stdout.write('Installing devDependencies...\n');
  await _install(outputDir, devDependencies, true);
}
