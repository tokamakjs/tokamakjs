import { Compiler, ProgressPlugin } from 'webpack';

import { barProgress } from './bar';
import { detailedProgress } from './detailed';

interface Config {
  mode?: 'bar' | 'detailed';
  summary?: VoidFunction;
}

export class BetterProgressPlugin extends ProgressPlugin {
  constructor({ mode = 'bar', summary = () => {} }: Config) {
    if (mode === 'bar') {
      super(barProgress(summary));
    } else {
      super(detailedProgress());
    }
  }

  public apply(compiler: Compiler): void {
    super.apply(compiler);

    compiler.hooks.done.tap('BetterProgressPlugin: done', () => {
      console.log('DONE IT IS');
    });
  }
}
