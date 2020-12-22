import { clearScreen } from 'ansi-escapes';
import { Compiler, ProgressPlugin } from 'webpack';

import { barProgress } from './bar';
import { detailedProgress } from './detailed';

interface Config {
  mode?: 'bar' | 'detailed';
  summary?: VoidFunction;
}

export class BetterProgressPlugin extends ProgressPlugin {
  private readonly _summary: VoidFunction;

  constructor({ mode = 'bar', summary = () => {} }: Config) {
    if (mode === 'bar') {
      super(barProgress());
    } else {
      super(detailedProgress());
    }

    this._summary = summary;
  }

  public apply(compiler: Compiler): void {
    super.apply(compiler);

    compiler.hooks.done.tap('BetterProgressPlugin: done', () => {
      process.stdout.write(clearScreen);
      this._summary();
    });
  }
}
