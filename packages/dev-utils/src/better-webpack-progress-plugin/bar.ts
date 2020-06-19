import { clearScreen } from 'ansi-escapes';
import chalk from 'chalk';
import cliTruncate from 'cli-truncate';
import figures from 'figures';
import logUpdate from 'log-update';
import { ProgressBar } from 'ongoing';
import { ProgressPlugin } from 'webpack';

process.on('SIGINT', () => process.exit());

function _capitalize(str: string): string {
  return str === '' ? str : str[0].toUpperCase() + str.slice(1);
}

function _truncate(message: string): string {
  const width = process.stdout.columns != null ? process.stdout.columns - 10 : 50;
  return cliTruncate(message, width, { position: 'middle' });
}

function _getShortenedPath(moduleName?: string): string {
  if (moduleName == null) return '';
  return moduleName.replace(process.cwd() + '/', '');
}

function _parseModuleProgress(moduleProgress?: string) {
  if (moduleProgress == null) return '';
  const [current, total] = moduleProgress.split('/');
  return `${current} of ${total}`;
}

function _getModulesMessage(moduleProgress?: string, moduleName?: string): string {
  if (moduleProgress == null && moduleName == null) {
    return '';
  }

  return `${_parseModuleProgress(moduleProgress)} :: ${_getShortenedPath(moduleName)}`;
}

export function barProgress(summary: VoidFunction): ProgressPlugin.Handler {
  const format = `${chalk.bold(':msg')}  :bar  ${chalk.green(':percent')} :mpr`;

  const progressBar = new ProgressBar(format, {
    completedChar: chalk.green('═'),
    incompletedChar: chalk.grey('─'),
  });

  return (
    percentage: number,
    message: string,
    moduleProgress?: string,
    _activeModules?: string,
    moduleName?: string,
  ) => {
    const moduleMessage =
      _truncate(_getModulesMessage(moduleProgress, moduleName)) ?? moduleProgress;

    logUpdate(
      progressBar.update(percentage, {
        msg: _capitalize(message),
        mpr: `\n ${chalk.grey(`${figures.arrowRight} ${moduleMessage}`)}`,
      }),
    );

    if (percentage >= 1) {
      logUpdate.clear();
      logUpdate.done();
      process.stdout.write(clearScreen);
      summary();
    }
  };
}
