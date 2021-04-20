import c from 'chalk';
import figures from 'figures';
import logUpdate from 'log-update';
import { ProgressBar } from 'ongoing';
import { ProgressPlugin } from 'webpack';

import { capitalize, getModulesMessage, truncate } from './utils';

process.on('SIGINT', () => process.exit());

export function barProgress(): ProgressPlugin.Handler {
  const format = `${c.bold(':msg')}  :bar  ${c.green(':percent')} :mpr`;

  const progressBar = new ProgressBar(format, {
    completedChar: c.green('═'),
    incompletedChar: c.grey('─'),
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
        mpr: `\n ${c.grey(`${figures.arrowRight} ${moduleMessage}`)}`,
      }),
    );

    if (percentage >= 0.99) {
      logUpdate.clear();
      logUpdate.done();
    }
  };
}
