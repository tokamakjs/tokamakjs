import { RouterModule, SubApp, createRoute } from '@tokamakjs/react';

import TodosRoute from './routes/todos';

@SubApp({
  routing: [createRoute('/', TodosRoute, [])],
  providers: [],
  imports: [RouterModule],
})
export class AppModule {}
