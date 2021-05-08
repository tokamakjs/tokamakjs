import { Controller, onDidMount, state } from '@tokamakjs/react';

import { TodosStore } from '~/stores';
import { Todo } from '~/types';

import { TodosView } from './todos.view';

function _poorsManUuid(): number {
  return new Date().getTime();
}

@Controller({ view: TodosView })
export class TodosController {
  @state private _todos = [] as Array<Todo>;

  constructor(private readonly _todosStore: TodosStore) {}

  get todos(): Array<Todo> {
    return this._todos.slice();
  }

  @onDidMount()
  public onDidMount(): VoidFunction {
    const subscription = this._todosStore.todos$.subscribe((todos) => (this._todos = todos));

    return () => {
      subscription.unsubscribe();
    };
  }

  public addTodo(todo: string): void {
    this._todosStore.addTodo({ id: _poorsManUuid(), value: todo, isDone: false });
  }

  public deleteTodo(todo: Todo): void {
    this._todosStore.deleteTodo(todo);
  }

  public editTodoValue(id: number, newValue: string): void {
    if (newValue == null || newValue === '') {
      this._todosStore.deleteTodo(id);
    } else {
      this._todosStore.editTodoValue(id, newValue);
    }
  }

  public toggleTodo(id: number): void {
    this._todosStore.toggleTodo(id);
  }

  public clearCompleted(): void {
    this._todosStore.clearCompleted();
  }
}
