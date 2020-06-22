import { OnModuleInit, injectable } from '@tokamakjs/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { TodosStorageService } from '~/services';

export interface Todo {
  id: number;
  value: string;
}

@injectable()
export class TodosStore implements OnModuleInit {
  private _todos = [] as Array<Todo>;
  public todos$: Subject<Array<Todo>>;

  constructor(private readonly _storageService: TodosStorageService) {
    this.todos$ = new BehaviorSubject([] as Array<Todo>);
  }

  onModuleInit() {
    this._todos = this._storageService.readTodos();
    this.todos$.subscribe((todos) => this._persistTodos(todos));
    this.todos$.next(this._todos.slice());
  }

  public addTodo(todo: Todo): void {
    this._todos.push(todo);
    this.todos$.next(this._todos.slice());
  }

  public deleteTodo(todo: Todo): void {
    this._todos = this._todos.filter((t) => t.id !== todo.id);
    this.todos$.next(this._todos.slice());
  }

  private _persistTodos(todos: Array<Todo>) {
    this._storageService.persistTodos(todos);
  }
}
