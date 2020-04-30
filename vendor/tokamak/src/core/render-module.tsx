import 'mobx-react/batchingForReactDom';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';

import { buildRoutes } from '../routing';
import { Type } from '../types';
import { AppContext } from './app-context';

export async function renderModule(metatype: Type, selector: string) {
  const appContext = await AppContext.create(metatype);

  const routes = buildRoutes(metatype, appContext);
  const RootNode = () => useRoutes(routes);

  render(
    <Router>
      <RootNode />
    </Router>,
    document.querySelector(selector),
  );
}
