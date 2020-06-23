import React from 'react';

import { NewTodo } from './NewTodo';

interface HeaderProps {
  onAddTodo: (todo: string) => void;
}

export const Header = ({ onAddTodo }: HeaderProps) => {
  return (
    <header className="header">
      <h1>todos</h1>
      <NewTodo onAdd={onAddTodo} />
    </header>
  );
};
