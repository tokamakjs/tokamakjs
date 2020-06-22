import { injectable } from '@tokamakjs/core';

import { Todo } from '~/stores';

@injectable()
export class TodosStorageService {
  public persistTodos(todos: Array<Todo>): void {
    localStorage.setItem('TodoMVC-Todos', JSON.stringify(todos));
  }

  public readTodos(): Array<Todo> {
    try {
      return JSON.parse(localStorage.getItem('TodoMVC-Todos') ?? '[]');
    } catch {
      localStorage.removeItem('TodoMVC-Todos');
      return [];
    }
  }
}
