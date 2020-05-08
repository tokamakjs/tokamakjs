import 'mobx-react/batchingForReactDom';

import { createBrowserHistory } from 'history';
import React, { Suspense } from 'react';
import { render } from 'react-dom';

import { Router, buildRoutes, useRoutes } from '../routing';
import { Type } from '../types';
import { AppContext } from './app-context';
import { HISTORY } from './constants';

export async function renderModule(metatype: Type, selector: string) {
  const appContext = await AppContext.create(metatype);

  const history = createBrowserHistory({ window });
  appContext.addProvider({ provide: HISTORY, useValue: history });

  const routes = buildRoutes(metatype, appContext);
  const RootNode = () => useRoutes(routes);

  // TODO: Create an appContext provider to access it
  // inside React

  render(
    <Router history={history}>
      <Suspense fallback={<div>Root loading...</div>}>
        <RootNode />
      </Suspense>
    </Router>,
    document.querySelector(selector),
  );
}
