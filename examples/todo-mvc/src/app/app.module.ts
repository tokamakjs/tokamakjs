import { createRoute, module } from '@tokamakjs/core';

import { TodosController } from './routes/todos';
import { TodosStorageService } from './services';
import { TodosStore } from './stores';

@module({
  routing: [createRoute('/', TodosController)],
  providers: [TodosStore, TodosStorageService],
})
export class AppModule {}
