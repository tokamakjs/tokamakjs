import { RouterModule, SubApp, createRoute } from '@tokamakjs/react';

import { TodosApi } from './api';
import TodosRoute from './routes/todos';
import { TodosService } from './services';
import { TodosStore } from './stores';

@SubApp({
  routing: [createRoute('/', TodosRoute, [])],
  providers: [TodosApi, TodosStore, TodosService],
  imports: [RouterModule],
})
export class AppModule {}
