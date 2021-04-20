import c from 'chalk';
import truncate from 'cli-truncate';
import stripAnsi from 'strip-ansi';

const rt = c.grey('┌');
const lt = c.grey('┐');
const vv = c.grey('│');
const hh = c.grey('─');
const rm = c.grey('├');
const lm = c.grey('┤');
const rb = c.grey('└');
const lb = c.grey('┘');
const ss = ' ';

function _repeat(times: number, char: string): string {
  return times < 0 ? char : new Array(times).fill(char).join('');
}

function _join(...args: Array<any>): string {
  return args.join('');
}

function _spaced(width: number, text: string): string {
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
