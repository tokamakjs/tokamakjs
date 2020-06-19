/// <reference path="../../types/larsbs__progress.d.ts" />

import ProgressBar from '@larsbs/progress';
import chalk from 'chalk';
import cliTruncate from 'cli-truncate';
import figures from 'figures';
import logUpdate from 'log-update';
import { ProgressPlugin } from 'webpack';

process.on('SIGINT', () => process.exit());

function _capitalize(str: string): string {
  return str === '' ? str : str[0].toUpperCase() + str.slice(1);
}

function _truncate(message: string): string {
  const width = process.stdout.columns != null ? process.stdout.columns - 10 : 50;
  return cliTruncate(message, width, { position: 'middle' });
}

function _getShortenedPath(moduleName: string): string {
  return moduleName.replace(process.cwd() + '/', '');
}

function _parseModuleProgress(moduleProgress: string) {
  const [current, total] = moduleProgress.split('/');
  return `${current} of ${total}`;
}

function _getModulesMessage(moduleProgress: string, moduleName: string): string {
  return `${_parseModuleProgress(moduleProgress)} :: ${_getShortenedPath(moduleName)}`;
}

export function barProgress(summary: VoidFunction): ProgressPlugin.Handler {
  const format = `${chalk.bold(':msg')}  :bar  ${chalk.green(':percent')} :mpr`;

  const progressBar = new ProgressBar(format, {
    complete: chalk.green('═'),
    incomplete: chalk.grey('─'),
    width: 30,
    total: 100,
  });

  return (
    percentage: number,
    message: string,
    moduleProgress: string,
    _activeModules: string,
    moduleName: string,
  ) => {
    const moduleMessage =
      _truncate(_getModulesMessage(moduleProgress, moduleName)) ?? moduleProgress;

    progressBar.update(percentage, {
      msg: _capitalize(message),
      mpr: `\n ${chalk.grey(`${figures.pointer} ${moduleMessage}`)}`,
    });

    logUpdate(progressBar.lastDraw);

    if (percentage === 1) {
      logUpdate.clear();
      logUpdate.done();
      summary();
    }
  };
}
