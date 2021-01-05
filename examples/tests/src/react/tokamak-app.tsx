import { Class, DiContainer } from '@tokamakjs/injection';
import { History, createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import React, { ElementType, createContext, useContext } from 'react';
import ReactDom from 'react-dom';

import { HISTORY, MATCH_BAG, MatchBag, buildRoutes, useRoutes } from './routing';
import { TokamakAppConfig } from './types';

const historyByMode = {
  browser: createBrowserHistory,
  hash: createHashHistory,
  memory: createMemoryHistory,
};

const AppContext = createContext<unknown>({});

export function useAppContext<T = unknown>(): T {
  return useContext(AppContext) as T;
}

export class TokamakApp {
  private _appContext: unknown = {};

  public static async create(
    RootApp: Class,
    partialConfig: Partial<TokamakAppConfig> = {},
  ): Promise<TokamakApp> {
    const config: TokamakAppConfig = { historyMode: 'browser', basePath: '', ...partialConfig };
    const history = historyByMode[config.historyMode]();
    const matchBag = new MatchBag();

    const container = await DiContainer.from(RootApp, {
      globalProviders: [
        { provide: HISTORY, useValue: history },
        { provide: MATCH_BAG, useValue: matchBag },
      ],
    });

    const routes = await buildRoutes(RootApp, container);
    const RootNode = () => useRoutes(routes, matchBag);

    return new TokamakApp(RootNode, history);
  }

  private constructor(
    private readonly _RootNode: ElementType,
    private readonly _history: History,
  ) {}

  public setAppContext(context: unknown): void {
    this._appContext = context;
  }

  public render(selector: string): void {
    const RootNode = this._RootNode;
    ReactDom.render(
      <AppContext.Provider value={this._appContext}>
        <RootNode />
      </AppContext.Provider>,
      document.querySelector(selector),
    );
  }
}
