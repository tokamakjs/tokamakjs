import { RouterModule } from '@tokamakjs/common';
import { SubApp, createRoute } from '@tokamakjs/react';

import { ChildView } from './routes/child';
import { RootView } from './routes/root';
import { ServiceA, ServiceB } from './services';

@SubApp({
  routing: [
    createRoute('/', RootView, [createRoute('/:projectId', ChildView)]),
    createRoute('/:projectId', RootView, [createRoute('/:projectId', ChildView)]),
  ],
  providers: [ServiceA, ServiceB],
  imports: [RouterModule],
})
export class AppModule {}
