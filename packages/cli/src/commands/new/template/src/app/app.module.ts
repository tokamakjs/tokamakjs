import { createRoute, module } from '@tokamakjs/core';

import { RootView } from './routes/root/root.view';

@module({
  routing: createRoute('/', RootView),
})
export class AppModule {}
