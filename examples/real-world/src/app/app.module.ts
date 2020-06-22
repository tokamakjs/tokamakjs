import { module } from '@tokamakjs/core';
import { createRoute } from 'packages/core/src/routing';

import { RootView } from './routes/root/root.view';

@module({
  routing: [createRoute('/', RootView)],
})
export class AppModule {}
