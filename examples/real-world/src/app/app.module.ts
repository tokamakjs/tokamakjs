import { createRoute, module } from '@tokamakjs/core';

import { RootController } from './routes/root';
import { ServiceA, ServiceB } from './routes/services';

@module({
  routing: [createRoute('/', RootController)],
  providers: [ServiceA, ServiceB],
})
export class AppModule {}
