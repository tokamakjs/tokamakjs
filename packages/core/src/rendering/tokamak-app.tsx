import 'reflect-metadata';

import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';

import { AppContext } from '../injection';
import { HISTORY, Router, buildRoutes, useRoutes } from '../routing';
import { Constructor } from '../utils';

export type RenderFn = (selector: string) => void;

export async function tokamak(metatype: Constructor): Promise<{ render: RenderFn }> {
  const appContext = await AppContext.create(metatype);

  const history = createBrowserHistory({ window });
  appContext.addGlobalProvider({ provide: HISTORY, useValue: history });

  await appContext.init();

  const routes = buildRoutes(metatype, appContext);
  const RootNode = () => useRoutes(routes);

  return {
    render(selector: string): void {
      render(
        <Router history={history}>
          <RootNode />
        </Router>,
        document.querySelector(selector),
      );
    },
  };
}
