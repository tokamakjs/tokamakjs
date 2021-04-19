import { RouterModule, SubApp, createRoute } from '@tokamakjs/react';

import { ChildView } from './routes/child';
import { RootView } from './routes/root';
import { ServiceA, ServiceB } from './services';

@SubApp({
  routing: [
    createRoute('/root', RootView, [createRoute('/child/:projectId', ChildView)]),
    createRoute('/:projectId', RootView, [createRoute('/:projectId', ChildView)]),
  ],
  providers: [ServiceA, ServiceB],
  imports: [RouterModule],
})
export class AppModule {}
