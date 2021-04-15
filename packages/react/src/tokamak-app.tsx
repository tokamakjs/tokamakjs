import { Class, DiContainer } from '@tokamakjs/injection';
import { History, createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import React, { ElementType, createContext } from 'react';
import ReactDom from 'react-dom';

import { HISTORY, MATCH_BAG, MatchBag, Router, buildRoutes, useRoutes } from './routing';
import { TokamakAppConfig } from './types';

const HISTORY_MODE_MAP = {
  browser: createBrowserHistory,
  hash: createHashHistory,
  memory: createMemoryHistory,
};

export const AppContext = createContext<unknown>({});

export const DiContainerContext = createContext<DiContainer | undefined>(undefined);

export class TokamakApp {
  public static async create(
    RootApp: Class,
    partialConfig: Partial<TokamakAppConfig> = {},
  ): Promise<TokamakApp> {
    const config: TokamakAppConfig = { historyMode: 'browser', basePath: '', ...partialConfig };
    const history = HISTORY_MODE_MAP[config.historyMode]();
    const matchBag = new MatchBag();

    const container = await DiContainer.from(RootApp, {
      globalProviders: [
        { provide: HISTORY, useValue: history },
        { provide: MATCH_BAG, useValue: matchBag },
      ],
    });

    const routes = buildRoutes(RootApp, container);
    const RootNode = () => useRoutes(routes, matchBag);

    return new TokamakApp(RootNode, history, container);
  }

  private constructor(
    private readonly _RootNode: ElementType,
    private readonly _history: History,
    private readonly _container: DiContainer,
  ) {}

  public render(selector: string, appContext: unknown = {}): void {
    const RootNode = this._RootNode;
    ReactDom.render(
      <Router history={this._history}>
        <DiContainerContext.Provider value={this._container}>
          <AppContext.Provider value={appContext}>
            <RootNode />
          </AppContext.Provider>
        </DiContainerContext.Provider>
      </Router>,
      document.querySelector(selector),
    );
  }
}
