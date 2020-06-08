import 'reflect-metadata';

import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';

import { Router, buildRoutes, useRoutes } from '../routing';
import { Type } from '../types';
import { AppContext } from './app-context';
import { HISTORY } from './constants';

export async function renderModule(metatype: Type, selector: string) {
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
