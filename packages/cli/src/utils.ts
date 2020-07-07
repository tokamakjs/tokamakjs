import path from 'path';

import fs from 'fs-extra';

export function logLine(...messages: Array<string>): void {
  if (messages.length <= 0) {
    process.stdout.write('\n');
  } else {
    process.stdout.write(messages.join(' ') + '\n');
  }
}

export function fileExists(filename: string): Promise<boolean> {
  return new Promise((r) => {
    fs.access(filename, fs.constants.F_OK, (err: any) => {
      return err == null ? r(true) : r(false);
    });
  });
}

export async function findProjectRoot(cwd = process.cwd()): Promise<string> {
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
    return findProjectRoot(path.resolve(cwd, '../'));
  }
}
