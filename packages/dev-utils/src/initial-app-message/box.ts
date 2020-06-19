import chalk from 'chalk';
import truncate from 'cli-truncate';
import stripAnsi from 'strip-ansi';

const rt = chalk.grey('┌');
const lt = chalk.grey('┐');
const vv = chalk.grey('│');
const hh = chalk.grey('─');
const rm = chalk.grey('├');
const lm = chalk.grey('┤');
const rb = chalk.grey('└');
const lb = chalk.grey('┘');
const ss = ' ';

function _repeat(times: number, char: string) {
  return times < 0 ? char : new Array(times).fill(char).join('');
}

function _join(...args: Array<any>) {
  return args.join('');
}

function _spaced(width: number, text: string) {
  text = truncate(text, width - 3);
  const textLength = stripAnsi(text).length;
  const spaceLength = width - 3 - textLength;
  const spacing = _repeat(spaceLength, ' ');
  return ` ${text} ${spacing} `;
}

export function createBox(
  width: number,
  { header, content }: { header: string; content: Array<string> },
): Array<string> {
  const lines = [];

  lines.push('');
  lines.push(_join(ss, rt, _repeat(width, hh), lt));
  lines.push(_join(ss, vv, _spaced(width, header), vv));
  lines.push(_join(ss, rm, _repeat(width, hh), lm));
  content.forEach((line) => lines.push(_join(ss, vv, _spaced(width, line), vv)));
  lines.push(_join(ss, rb, _repeat(width, hh), lb));
  lines.push('');
  lines.push('');

  return lines;
}
