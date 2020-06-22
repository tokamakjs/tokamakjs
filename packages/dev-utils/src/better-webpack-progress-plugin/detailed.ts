import chalk from 'chalk';
import figures from 'figures';
import { ProgressPlugin } from 'webpack';

import { capitalize, getModulesMessage, truncate } from './utils';

process.on('SIGINT', () => process.exit());

function _getSimpleMessage(message: string): string {
  if (message.match(/building|sealing/i)) {
    return 'Building modules';
  }
  if (message.match(/asset optimization/i)) {
    return 'Processing modules';
  }
  if (message.match(/optimization|optimizing|reviving/i)) {
    return 'Optimizing modules';
  }
  if (message.match(/processing|hashing|recording/i)) {
    return 'Processing modules';
  }

  return capitalize(message);
}

function _getLogMessage(percentage: number, moduleProgress?: string, moduleName?: string) {
  const modulesMessage = getModulesMessage(moduleProgress, moduleName);
  const finalMessage = `  ${figures.arrowRight} [${Math.floor(
    percentage * 100,
  )}%] ${modulesMessage}`;
  return modulesMessage ? finalMessage : '';
}

function _writeToStdout(text: string): void {
  process.stdout.write(`${text}\n`);
}

export function detailedProgress(): ProgressPlugin.Handler {
  _writeToStdout(chalk.bold('Webpack starting...'));

  let latestMessage: string;

  return (
    percentage: number,
    message: string,
    moduleProgress: string,
    _activeModules: string,
    moduleName: string,
  ): void => {
    const newMessage = _getSimpleMessage(message);

    if (newMessage === latestMessage) {
      const logMessage = _getLogMessage(percentage, moduleProgress, moduleName);
      if (logMessage) {
        _writeToStdout(chalk.grey(truncate(logMessage)));
      }
    } else if (percentage >= 1 && newMessage) {
      _writeToStdout(figures.pointer + ' ' + newMessage);
    } else {
      if (newMessage) {
        _writeToStdout(figures.pointer + ' ' + newMessage);
      }

      const logMessage = _getLogMessage(percentage, moduleProgress, moduleName);
      if (logMessage) {
        _writeToStdout(chalk.grey(truncate(logMessage)));
      }
    }

    latestMessage = newMessage;
  };
}
