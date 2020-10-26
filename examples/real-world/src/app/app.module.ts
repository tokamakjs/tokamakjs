import { RouterModule } from '@tokamakjs/common';
import { createRoute, module } from '@tokamakjs/core';

import { ChildController } from './routes/child/child.controller';
import { RootController } from './routes/root';
import { ServiceA, ServiceB } from './services';

@module({
  routing: [
    createRoute('/:projectId', RootController, [createRoute('/:projectId', ChildController)]),
  ],
  providers: [ServiceA, ServiceB],
  imports: [RouterModule],
})
export class AppModule {}
