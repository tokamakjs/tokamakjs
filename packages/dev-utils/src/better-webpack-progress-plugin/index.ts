import { clearScreen } from 'ansi-escapes';
import stripAnsi from 'strip-ansi';
import { Compiler, ProgressPlugin } from 'webpack';

import { barProgress } from './bar';
import { detailedProgress } from './detailed';
import { hookTo } from './utils';

interface Config {
  mode?: 'bar' | 'detailed';
  summary?: VoidFunction;
}

export class BetterProgressPlugin extends ProgressPlugin {
  private readonly _summary: VoidFunction;
  private readonly _capturedLogMessages: Array<string> = [];

  constructor({ mode = 'bar', summary = () => {} }: Config) {
    super(mode === 'bar' ? barProgress() : detailedProgress());
    this._summary = summary;
  }

  public apply(compiler: Compiler): void {
    super.apply(compiler);

    // Capture stderr messages to log them after the compilation has finished.
    const _revokeStderrHook = hookTo(process.stderr, 'write', (data: Uint8Array | string) => {
      if (typeof data === 'string') {
        data = stripAnsi(data.trim());
        if (data != '') {
          this._capturedLogMessages.push(data);
        }
      }
      return true;
    });

    compiler.hooks.done.tap('BetterProgressPlugin: done', () => {
      _revokeStderrHook?.();

      process.stdout.write(clearScreen);
      this._summary();

      this._capturedLogMessages.forEach((message) => {
        process.stderr.write(message + '\n');
      });

      process.stdout.write('\n\n');
    });
  }
}
