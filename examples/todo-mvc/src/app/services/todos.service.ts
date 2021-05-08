import { Injectable, onModuleInit } from '@tokamakjs/react';

import { TodosApi } from '~/api';
import { TodosStore } from '~/stores';
import { Todo } from '~/types';

@Injectable()
export class TodosService {
  get todos$() {
    return this._todosStore.todos$;
  }

  constructor(private readonly _todosApi: TodosApi, private readonly _todosStore: TodosStore) {}

  @onModuleInit()
  public initStore(): void {
    const todos = this._todosApi.loadTodos();
    this._todosStore.initStore(todos);
    this.todos$.subscribe((todos) => this._todosApi.saveTodos(todos));
  }

  public addTodo(todo: Todo): void {
    this._todosStore.addTodo(todo);
  }

  public deleteTodo(todo: number | Todo): void {
    this._todosStore.deleteTodo(todo);
  }

  public editTodoValue(id: number, newValue: string): void {
    this._todosStore.editTodoValue(id, newValue);
  }

  public toggleTodo(id: number): void {
    this._todosStore.toggleTodo(id);
  }

  public clearCompleted(): void {
    this._todosStore.clearCompleted();
  }
}
