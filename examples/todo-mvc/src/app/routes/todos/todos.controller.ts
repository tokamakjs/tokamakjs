import { RouterService } from '@tokamakjs/common';
import { Controller, memo, onDidMount, state } from '@tokamakjs/react';

import { TodosService } from '~/services';
import { Todo } from '~/types';

import { TodosView } from './todos.view';

function _poorsManUuid(): number {
  return new Date().getTime();
}

@Controller({ view: TodosView })
export class TodosController {
  @state private _todos = [] as Array<Todo>;

  @memo((self: TodosController) => [self.todos])
  get uncompletedTodos(): Array<Todo> {
    return this.todos.filter((t) => !t.isDone);
  }

  @memo((self: TodosController) => [self.todos, self.filterBy])
  get filteredTodos(): Array<Todo> {
    if (this.filterBy === 'active') {
      return this.todos.filter((t) => !t.isDone);
    } else if (this.filterBy === 'completed') {
      return this.todos.filter((t) => t.isDone);
    } else {
      return this.todos;
    }
  }

  get todos(): Array<Todo> {
    return this._todos;
  }

  get filterBy(): 'active' | 'completed' | undefined {
    return this._router.query.get('filterBy') as 'active' | 'completed' | undefined;
  }

  constructor(
    private readonly _todosService: TodosService,
    private readonly _router: RouterService,
  ) {}

  @onDidMount()
  public onDidMount(): VoidFunction {
    const subscription = this._todosService.todos$.subscribe((todos) => (this._todos = todos));

    return () => {
      subscription.unsubscribe();
    };
  }

  public addTodo(todo: string): void {
    this._todosService.addTodo({ id: _poorsManUuid(), value: todo, isDone: false });
  }

  public deleteTodo(todo: Todo): void {
    this._todosService.deleteTodo(todo);
  }

  public editTodoValue(id: number, newValue: string): void {
    if (newValue == null || newValue === '') {
      this._todosService.deleteTodo(id);
    } else {
      this._todosService.editTodoValue(id, newValue);
    }
  }

  public toggleTodo(id: number): void {
    this._todosService.toggleTodo(id);
  }

  public clearCompleted(): void {
    this._todosService.clearCompleted();
  }
}
