import { Injectable } from '@tokamakjs/react';

import { Todo } from '~/types';

@Injectable()
export class TodosApi {
  public loadTodos(): Array<Todo> {
    try {
      return JSON.parse(localStorage.getItem('todos-tokamak') ?? '[]');
    } catch {
      localStorage.removeItem('todos-tokamak');
      return [];
    }
  }

  public saveTodos(todos: Array<Todo>): void {
    localStorage.setItem('todos-tokamak', JSON.stringify(todos));
  }
}
