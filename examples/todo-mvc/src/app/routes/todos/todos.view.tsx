import { useLocation } from '@tokamakjs/core';
import qs from 'query-string';
import React, { Fragment, useMemo } from 'react';

import { Footer, Header, Main } from '~/components';

import { TodosController } from './todos.controller';

export const TodosView = (ctrl: TodosController) => {
  const { search } = useLocation();
  const { filterBy } = qs.parse(search);

  const uncompletedTodos = useMemo(() => ctrl.todos.filter((t) => !t.isDone), [ctrl.todos]);
  const filteredTodos = useMemo(() => {
    if (filterBy === 'active') {
      return ctrl.todos.filter((t) => !t.isDone);
    } else if (filterBy === 'completed') {
      return ctrl.todos.filter((t) => t.isDone);
    } else {
      return ctrl.todos;
    }
  }, [ctrl.todos, filterBy]);

  return (
    <Fragment>
      <Header onAddTodo={(todo) => ctrl.addTodo(todo)} />
      {filteredTodos.length > 0 ? (
        <Fragment>
          <Main
            todos={filteredTodos}
            onClickDeleteTodo={(todo) => ctrl.deleteTodo(todo)}
            onEditTodoValue={(id, newValue) => {
              ctrl.editTodoValue(id, newValue);
            }}
            onClickDone={(todo) => ctrl.toggleTodo(todo.id)}
          />
          <Footer
            activeFilter={filterBy as 'active' | 'completed' | undefined}
            todoCount={uncompletedTodos.length}
            displayClear={ctrl.todos.length !== uncompletedTodos.length}
            onClickClear={() => ctrl.clearCompleted()}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};
