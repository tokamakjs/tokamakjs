export type DoubleClickHandler<T> = (context: T) => () => void;

export interface Todo {
  id: number;
  value: string;
  isDone: boolean;
}
