import cliTruncate from 'cli-truncate';

export function capitalize(str: string): string {
  return str === '' ? str : str[0].toUpperCase() + str.slice(1);
}

export function getShortenedPath(moduleName?: string): string {
  if (moduleName == null) return '';
  return moduleName.replace(process.cwd() + '/', '');
}

export function parseModuleProgress(moduleProgress?: string) {
  if (moduleProgress == null) return '';
  const [current, total] = moduleProgress.split('/');
  return `${current} of ${total}`;
}

export function getModulesMessage(moduleProgress?: string, moduleName?: string): string {
  return moduleProgress == null && moduleName == null
    ? ''
    : `${parseModuleProgress(moduleProgress)} :: ${getShortenedPath(moduleName)}`;
}

export function truncate(message: string): string {
  const width = process.stdout.columns != null ? process.stdout.columns - 10 : 50;
  return cliTruncate(message, width, { position: 'middle' });
}
