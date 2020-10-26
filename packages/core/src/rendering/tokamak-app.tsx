import 'reflect-metadata';

import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';

import { AppContext } from '../injection';
import { HISTORY, MATCH_BAG, Router, buildRoutes, useRoutes } from '../routing';
import { MatchBag } from '../routing/match-bag';
import { Constructor } from '../utils';

export type RenderFn = (selector: string) => void;

export async function tokamak(metatype: Constructor): Promise<{ render: RenderFn }> {
  const appContext = await AppContext.create(metatype);

  const history = createBrowserHistory({ window });
  appContext.addGlobalProvider({ provide: HISTORY, useValue: history });

  const matchBag = new MatchBag();
  appContext.addGlobalProvider({ provide: MATCH_BAG, useValue: matchBag });

  await appContext.init();

  const routes = buildRoutes(metatype, appContext);
  const RootNode = () => useRoutes(routes, matchBag);

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
