import React, { useState } from 'react';

import { useDoubleClick, useOnClickOutside } from '~/hooks';
import { Todo } from '~/stores';

interface MainProps {
  todos: Array<Todo>;
  onClickDeleteTodo: (todo: Todo) => void;
  onEditTodo: (id: number, newValue: string) => void;
}

export const Main = ({ todos, onClickDeleteTodo, onEditTodo }: MainProps) => {
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>();
  const [todoValue, setTodoValue] = useState<string>('');

  const isEditing = editingTodo != null;

  const handleDoubleClick = useDoubleClick<Todo>((todo) => {
    setTodoValue(todo.value);
    setEditingTodo(todo);
  });

  const inputRef = useOnClickOutside<HTMLInputElement>(() => {
    onEditTodo(editingTodo!.id, todoValue);
    setTodoValue('');
    setEditingTodo(undefined);
  });

  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={isEditing ? 'editing' : undefined}
            onClick={handleDoubleClick(todo)}>
            <div className="view">
              <input className="toggle" type="checkbox" />
              <label>{todo.value}</label>
              <button className="destroy" onClick={() => onClickDeleteTodo(todo)}></button>
            </div>
            {isEditing ? (
              <input
                ref={inputRef}
                className="edit"
                value={todoValue}
                autoFocus
                onChange={(e) => setTodoValue(e.target.value)}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
};
