import { clearScreen } from 'ansi-escapes';
import chalk from 'chalk';
import figures from 'figures';
import logUpdate from 'log-update';
import { ProgressBar } from 'ongoing';
import { ProgressPlugin } from 'webpack';

import { capitalize, getModulesMessage, truncate } from './utils';

process.on('SIGINT', () => process.exit());

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
  ): void => {
    const moduleMessage = truncate(getModulesMessage(moduleProgress, moduleName)) ?? moduleProgress;

    logUpdate(
      progressBar.update(percentage, {
        msg: capitalize(message),
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
