import { ProgressPlugin } from 'webpack';

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
}
