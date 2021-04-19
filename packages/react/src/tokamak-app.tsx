import { Class, DiContainer } from '@tokamakjs/injection';
import React, { ElementType, createContext } from 'react';
import ReactDom from 'react-dom';

import { BrowserRouter, HashRouter, MemoryRouter, buildRoutes, useRoutes } from './routing';
import { TokamakAppConfig } from './types';

const HISTORY_MODE_MAP = {
  browser: BrowserRouter,
  hash: HashRouter,
  memory: MemoryRouter,
};

export const AppContext = createContext<unknown>({});

export const DiContainerContext = createContext<DiContainer | undefined>(undefined);

export class TokamakApp {
  public static async create(
    RootApp: Class,
    partialConfig: Partial<TokamakAppConfig> = {},
  ): Promise<TokamakApp> {
    const config: TokamakAppConfig = { historyMode: 'browser', basePath: '', ...partialConfig };
    const Router = HISTORY_MODE_MAP[config.historyMode];

    const container = await DiContainer.from(RootApp, {
      globalProviders: [],
    });

    const routes = buildRoutes(RootApp, container);
    const RootNode = () => useRoutes(routes);

    return new TokamakApp(RootNode, Router, container);
  }

  private constructor(
    private readonly _RootNode: ElementType,
    private readonly _Router: ElementType,
    private readonly _container: DiContainer,
  ) {}

  public render(selector: string, appContext: unknown = {}): void {
    const RootNode = this._RootNode;
    ReactDom.render(
      <this._Router>
        <DiContainerContext.Provider value={this._container}>
          <AppContext.Provider value={appContext}>
            <RootNode />
          </AppContext.Provider>
        </DiContainerContext.Provider>
      </this._Router>,
      document.querySelector(selector),
    );
  }
}
