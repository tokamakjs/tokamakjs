import React from 'react';

import { Todo } from '~/stores';

interface MainProps {
  todos: Array<Todo>;
  onClickDeleteTodo: (todo: Todo) => void;
}

export const Main = ({ todos, onClickDeleteTodo }: MainProps) => {
  return (
    <section className="main">
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <div className="view">
              <input className="toggle" type="checkbox" />
              <label>{todo.value}</label>
              <button className="destroy" onClick={() => onClickDeleteTodo(todo)}></button>
            </div>
            <input className="edit" value={todo.value} readOnly />
          </li>
        ))}
      </ul>
    </section>
  );
};
