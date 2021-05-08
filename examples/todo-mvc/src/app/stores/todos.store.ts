import { Injectable } from '@tokamakjs/react';
import { BehaviorSubject } from 'rxjs';

import { Todo } from '~/types';

@Injectable()
export class TodosStore {
  public readonly todos$ = new BehaviorSubject<Array<Todo>>([]);

  private _todos = [] as Array<Todo>;

  public initStore(todos: Array<Todo>): void {
    this._todos = todos;
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
}
