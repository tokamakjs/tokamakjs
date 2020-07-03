import path from 'path';

import execa from 'execa';
import fs from 'fs-extra';

const TEMPLATE_DIR = path.resolve(__dirname, 'template');

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
    process.stdout.write(
      'The target directory seems to contain a project already. Try using a different name or removing the folder first.\n',
    );
    process.exit(1);
  }

  process.stdout.write(`Creating a Tokamak app in ${outputDir}...\n`);

  process.stdout.write('Copying files into destination...\n');
  await fs.copy(TEMPLATE_DIR, outputDir);

  process.stdout.write('Installing dependencies...\n');
  await _install(outputDir, dependencies, false);

  process.stdout.write('Installing devDependencies...\n');
  await _install(outputDir, devDependencies, true);

  process.stdout.write(`App created succesfully in ${outputDir}\n`);
  process.stdout.write(`Inside the newly created directory, you can run:\n`);
  process.stdout.write(`  - npm start\n`);
  process.stdout.write(`    Starts the app in development mode.\n`);
  process.stdout.write(`  - npm run build\n`);
  process.stdout.write(`    Builds the app for deployment.\n`);
}
