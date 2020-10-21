import { RouterModule } from '@tokamakjs/common';
import { createRoute, module } from '@tokamakjs/core';

import { RootController } from './routes/root';
import { ServiceA, ServiceB } from './routes/services';

@module({
  routing: [createRoute('/:id', RootController)],
  providers: [ServiceA, ServiceB],
  imports: [RouterModule],
})
export class AppModule {}
