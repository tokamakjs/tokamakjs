import React, { Fragment } from 'react';

import { Footer, Header, Main } from '~/components';

import { useTodosFacade } from './todos.facade';

export const TodosView = () => {
  const { todos } = useTodosFacade();
  return (
    <Fragment>
      <Header onAddTodo={(todo) => console.log(todo)} />
      {todos.length > 0 ? (
        <Fragment>
          <Main />
          <Footer />
        </Fragment>
      ) : null}
    </Fragment>
  );
};
