import { Link } from '@tokamakjs/react';
import React from 'react';

interface FooterProps {
  activeFilter?: 'active' | 'completed';
  todoCount: number;
  displayClear: boolean;
  onClickClear: VoidFunction;
}

export const Footer = ({ activeFilter, todoCount, displayClear, onClickClear }: FooterProps) => {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todoCount}</strong> {todoCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <Link className={activeFilter == null ? 'selected' : undefined} href="/">
            All
          </Link>
        </li>
        <li>
          <Link
            className={activeFilter === 'active' ? 'selected' : undefined}
            href="?filterBy=active">
            Active
          </Link>
        </li>
        <li>
          <Link
            className={activeFilter === 'completed' ? 'selected' : undefined}
            href="?filterBy=completed">
            Completed
          </Link>
        </li>
      </ul>
      {displayClear ? (
        <button className="clear-completed" onClick={() => onClickClear()}>
          Clear completed
        </button>
      ) : null}
    </footer>
  );
};
