import React, { Fragment } from 'react';

import { Footer, Header, Main } from '~/components';

import { TodosController } from './todos.controller';

export const TodosView = (ctrl: TodosController) => {
  return (
    <Fragment>
      <Header onAddTodo={(todo) => ctrl.addTodo(todo)} />
      {ctrl.todos.length > 0 ? (
        <Fragment>
          <Main
            todos={ctrl.todos}
            onClickDeleteTodo={(todo) => ctrl.deleteTodo(todo)}
            onEditTodoValue={(id, newValue) => {
              ctrl.editTodoValue(id, newValue);
            }}
            onClickDone={(todo) => ctrl.toggleTodo(todo.id)}
          />
          <Footer
            todoCount={ctrl.uncompletedTodos.length}
            displayClear={ctrl.todos.length !== ctrl.uncompletedTodos.length}
            onClickClear={() => ctrl.clearCompleted()}
          />
        </Fragment>
      ) : null}
    </Fragment>
  );
};
