import { OnModuleInit, injectable } from '@tokamakjs/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { TodosStorageService } from '~/services';

export interface Todo {
  id: number;
  value: string;
  isDone: boolean;
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

  public deleteTodo(todo: Todo | number): void {
    this._todos = this._todos.filter((t) => t.id !== (typeof todo === 'number' ? todo : todo.id));
    this.todos$.next(this._todos.slice());
  }

  public editTodoValue(id: number, newValue: string): void {
    const index = this._todos.findIndex((t) => t.id === id);
    this._todos[index] = { ...this._todos[index], value: newValue };
    this.todos$.next(this._todos.slice());
  }

  public toggleTodo(id: number): void {
    const index = this._todos.findIndex((t) => t.id === id);
    const todo = this._todos[index];
    this._todos[index] = { ...todo, isDone: !todo.isDone };
    this.todos$.next(this._todos.slice());
  }

  public clearCompleted(): void {
    this._todos = this._todos.filter((t) => !t.isDone);
    this.todos$.next(this._todos.slice());
  }

  private _persistTodos(todos: Array<Todo>) {
    this._storageService.persistTodos(todos);
  }
}
