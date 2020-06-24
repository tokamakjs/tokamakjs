import path from 'path';

import figures from 'figures';
import fs from 'fs-extra';
import ora from 'ora';

const TEMPLATE_DIR = path.resolve(__dirname, 'template');

export async function newAction(name: string) {
  const outputDir = path.resolve(process.cwd(), name);

  const spinner = ora();

  spinner.start('Copying files into destination...');
  await fs.copy(TEMPLATE_DIR, outputDir);
  spinner.stopAndPersist({
    text: 'Finished copying files into destination.',
    symbol: figures.pointer,
  });
}
