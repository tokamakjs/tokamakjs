import React, { Fragment } from 'react';

import { Footer, Header, Main } from '~/components';

import { TodosController } from './todos.controller';

export const TodosView = (ctrl: TodosController) => {
  return (
    <Fragment>
      <Header onAddTodo={(todo) => ctrl.addTodo(todo)} />
      {ctrl.todos.length > 0 ? (
        <Fragment>
          <Main todos={ctrl.todos} />
          <Footer />
        </Fragment>
      ) : null}
    </Fragment>
  );
};
