import { injectable } from '@tokamakjs/core';

import { Todo } from '~/stores';

@injectable()
export class TodosStorageService {
  public persistTodos(todos: Array<Todo>): void {
    localStorage.setItem('todos-tokamak', JSON.stringify(todos));
  }

  public readTodos(): Array<Todo> {
    try {
      return JSON.parse(localStorage.getItem('todos-tokamak') ?? '[]');
    } catch {
      localStorage.removeItem('todos-tokamak');
      return [];
    }
  }
}