import { createRoute, module } from '@tokamakjs/core';

import { TodosView } from './routes/todos/todos.view';

@module({
  routing: [createRoute('/', TodosView)],
})
export class AppModule {}
