import React from 'react';

interface FooterProps {
  todoCount: number;
  displayClear: boolean;
  onClickClear: VoidFunction;
}

export const Footer = ({ todoCount, displayClear, onClickClear }: FooterProps) => {
  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todoCount}</strong> item left
      </span>
      <ul className="filters">
        <li>
          <a className="selected" href="#/">
            All
          </a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
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
