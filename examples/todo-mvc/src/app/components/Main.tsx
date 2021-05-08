import cn from 'classnames';
import React, { useState } from 'react';

import { useDoubleClick, useOnClickOutside } from '~/app/hooks';
import { Todo } from '~/app/types';

const ENTER_KEY = 13;
const ESC_KEY = 27;

interface MainProps {
  todos: Array<Todo>;
  onClickDeleteTodo: (todo: Todo) => void;
  onEditTodoValue: (id: number, newValue: string) => void;
  onClickDone: (todo: Todo) => void;
}

export const Main = ({ todos, onClickDeleteTodo, onEditTodoValue, onClickDone }: MainProps) => {
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [todoValue, setTodoValue] = useState<string>('');

  const handleDoubleClick = useDoubleClick<Todo>((todo) => {
    setTodoValue(todo.value);
    setEditingTodo(todo);
  });

  const inputRef = useOnClickOutside<HTMLInputElement>(() => {
    onEditTodoValue(editingTodo!.id, todoValue.trim());
    setTodoValue('');
    setEditingTodo(undefined);
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      onEditTodoValue(editingTodo!.id, todoValue.trim());
      setTodoValue('');
      setEditingTodo(undefined);
    } else if (e.keyCode === ESC_KEY) {
      e.preventDefault();
      setTodoValue('');
      setEditingTodo(undefined);
    }
  };

  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={cn({
              editing: editingTodo?.id === todo.id,
              completed: todo.isDone,
            })}
            onClick={handleDoubleClick(todo)}>
            <div className="view">
              <input
                className="toggle"
                type="checkbox"
                checked={todo.isDone}
                onChange={() => onClickDone(todo)}
              />
              <label>{todo.value}</label>
              <button className="destroy" onClick={() => onClickDeleteTodo(todo)}></button>
            </div>
            {editingTodo?.id === todo.id ? (
              <input
                ref={inputRef}
                className="edit"
                value={todoValue}
                autoFocus
                onChange={(e) => setTodoValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
