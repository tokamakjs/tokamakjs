import React, { useState } from 'react';

import { ENTER_KEY } from '~/constants';

interface NewTodoProps {
  onAdd: (todo: string) => void;
}

export const NewTodo = ({ onAdd }: NewTodoProps) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER_KEY) {
      e.preventDefault();
      if (newTodo.trim() !== '') {
        onAdd(newTodo.trim());
        setNewTodo('');
      }
    }
  };

  return (
    <input
      className="new-todo"
      placeholder="What needs to be done?"
      autoFocus
      onKeyDown={handleAddTodo}
      name="todo"
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
    />
  );
};
