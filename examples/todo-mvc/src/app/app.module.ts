import { RouterModule, SubApp, createRoute } from '@tokamakjs/react';

import TodosRoute from './routes/todos';
import { TodosStorageService } from './services';
import { TodosStore } from './stores';

@SubApp({
  routing: [createRoute('/', TodosRoute, [])],
  providers: [TodosStorageService, TodosStore],
  imports: [RouterModule],
})
export class AppModule {}
