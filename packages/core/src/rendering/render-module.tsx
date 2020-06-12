import 'reflect-metadata';

import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';

import { AppContext } from '../injection';
import { HISTORY, Router, buildRoutes, useRoutes } from '../routing';
import { Constructor } from '../utils';

export async function renderModule(metatype: Constructor, selector: string) {
  const appContext = await AppContext.create(metatype);

  const history = createBrowserHistory({ window });
  appContext.addGlobalProvider({ provide: HISTORY, useValue: history });

  await appContext.init();

  const routes = buildRoutes(metatype, appContext);
  const RootNode = () => useRoutes(routes);

  render(
    <Router history={history}>
      <RootNode />
    </Router>,
    document.querySelector(selector),
  );
}
