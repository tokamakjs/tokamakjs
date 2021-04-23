import { RouterModule, SubApp, createRedirection, createRoute } from '@tokamakjs/react';

import { ChildView } from './routes/child';
import { RootView } from './routes/root';
import { ServiceA, ServiceB } from './services';

@SubApp({
  routing: [
    createRoute('/root', RootView, [createRoute('/:projectId', ChildView)]),
    createRoute('/child/:projectId', ChildView),
    createRedirection('/', '/root'),
  ],
  providers: [ServiceA, ServiceB],
  imports: [RouterModule],
})
export class AppModule {}
