import { controller, observable, onDidMount } from '@tokamakjs/core';

import { Todo, TodosStore } from '~/stores';

import { TodosView } from './todos.view';

function _poorsManUuid(): number {
  return new Date().getTime();
}

@controller({ view: TodosView })
export class TodosController {
  @observable private _todos = [] as Array<Todo>;

  constructor(private readonly todosStore: TodosStore) {}

  get todos() {
    return this._todos;
  }

  @onDidMount()
  public onDidMount() {
    const subscription = this.todosStore.todos$.subscribe((todos) => (this._todos = todos));

    return () => {
      subscription.unsubscribe();
    };
  }

  public addTodo(todo: string): void {
    this.todosStore.addTodo({ id: _poorsManUuid(), value: todo, isDone: false });
  }

  public deleteTodo(todo: Todo): void {
    this.todosStore.deleteTodo(todo);
  }

  public editTodoValue(id: number, newValue: string): void {
    if (newValue == null || newValue === '') {
      this.todosStore.deleteTodo(id);
    } else {
      this.todosStore.editTodoValue(id, newValue);
    }
  }

  public toggleTodo(id: number): void {
    this.todosStore.toggleTodo(id);
  }

  public clearCompleted(): void {
    this.todosStore.clearCompleted();
  }
}
