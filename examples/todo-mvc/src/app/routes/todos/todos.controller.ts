import { OnDidMount, controller, observable } from '@tokamakjs/core';

import { Todo, TodosStore } from '~/stores';

import { TodosView } from './todos.view';

function _poorsManUuid(): number {
  return new Date().getTime();
}

@controller({ view: TodosView })
export class TodosController implements OnDidMount {
  @observable private _todos = [] as Array<Todo>;

  constructor(private readonly todosStore: TodosStore) {}

  get todos() {
    return this._todos;
  }

  onDidMount() {
    const subscription = this.todosStore.todos$.subscribe((todos) => (this._todos = todos));

    return () => {
      subscription.unsubscribe();
    };
  }

  addTodo(todo: string): void {
    this.todosStore.addTodo({ id: _poorsManUuid(), value: todo });
  }

  deleteTodo(todo: Todo): void {
    this.todosStore.deleteTodo(todo);
  }
}
