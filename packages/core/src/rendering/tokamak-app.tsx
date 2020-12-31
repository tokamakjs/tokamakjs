import 'reflect-metadata';

import { createBrowserHistory } from 'history';
import React, { ElementType, useContext } from 'react';
import { render } from 'react-dom';

import { AppContext } from '../injection';
import { HISTORY, MATCH_BAG, Router, buildRoutes, useRoutes } from '../routing';
import { MatchBag } from '../routing/match-bag';
import { Constructor } from '../utils';

const ReactAppContext = React.createContext({});

export function useAppContext<T = any>(): T {
  return useContext(ReactAppContext) as T;
}

class TokamakApp {
  private _appContext: any = {};

  constructor(
    private readonly _RootNode: ElementType,
    private readonly _history: ReturnType<typeof createBrowserHistory>,
  ) {}

  public render(selector: string): void {
    render(
      <Router history={this._history}>
        <ReactAppContext.Provider value={this._appContext}>
          <this._RootNode />
        </ReactAppContext.Provider>
      </Router>,
      document.querySelector(selector),
    );
  }

  public setAppContext(context: any): void {
    this._appContext = context;
  }
}

export async function tokamak(metatype: Constructor): Promise<TokamakApp> {
  const appContext = await AppContext.create(metatype);

  const history = createBrowserHistory({ window });
  appContext.addGlobalProvider({ provide: HISTORY, useValue: history });

  const matchBag = new MatchBag();
  appContext.addGlobalProvider({ provide: MATCH_BAG, useValue: matchBag });

  await appContext.init();

  const routes = await buildRoutes(metatype, appContext);
  const RootNode = () => useRoutes(routes, matchBag);

  return new TokamakApp(RootNode, history);
}
