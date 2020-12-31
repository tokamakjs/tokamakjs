import { RouterModule } from '@tokamakjs/common';
import { Module, createRoute } from '@tokamakjs/core';

import { ChildController } from './routes/child/child.controller';
import { RootController } from './routes/root';
import { ServiceA, ServiceB } from './services';

@Module({
  routing: [
    // createRoute('/', RootController, [createRoute('/:projectId', ChildController)]),
    createRoute('/:projectId', RootController, [createRoute('/:projectId', ChildController)]),
  ],
  providers: [ServiceA, ServiceB],
  imports: [RouterModule],
})
export class AppModule {}
