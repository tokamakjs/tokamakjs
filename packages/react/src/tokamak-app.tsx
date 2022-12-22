import { GlobalErrorsManager } from '@tokamakjs/common';
import { Class, DiContainer } from '@tokamakjs/injection';
import React, { ElementType } from 'react';
import { createRoot } from 'react-dom/client';

import { DiContainerProvider } from './components';
import { AppContext, ErrorsContext, PathsContext } from './hooks';
import {
  BrowserRouter,
  HashRouter,
  MemoryRouter,
  RouteObject,
  buildRoutes,
  useRoutes,
} from './routing';
import { TokamakAppConfig, TokamakCreateConfig } from './types';

const HISTORY_MODE_MAP = {
  browser: BrowserRouter,
  hash: HashRouter,
  memory: MemoryRouter,
};

export class TokamakApp {
  public static async create(
    RootApp: Class,
    partialConfig: TokamakCreateConfig = {},
  ): Promise<TokamakApp> {
    const { globalProviders, ...config } = {
      historyMode: 'browser' as const,
      basePath: '',
      globalProviders: [],
      ...partialConfig,
    };

    const container = await DiContainer.from(RootApp, { globalProviders });

    return new TokamakApp(container, RootApp, config);
  }

  private readonly _Router: typeof HISTORY_MODE_MAP[keyof typeof HISTORY_MODE_MAP];
  private readonly _RootNode: ElementType;
  private readonly _paths: Array<string> = [];
  private readonly _globalErrorsManager: GlobalErrorsManager;

  private constructor(
    private readonly _container: DiContainer,
    RootApp: Class,
    private readonly _config: TokamakAppConfig,
  ) {
    const routes = buildRoutes(RootApp, _container);
    this._paths = this._extractPathsFromRoutes(routes);
    this._RootNode = () => useRoutes(routes);
    this._Router = HISTORY_MODE_MAP[_config.historyMode];
    this._globalErrorsManager = new GlobalErrorsManager();
  }

  public render(selector: string, appContext: unknown = {}): void {
    const RootNode = this._RootNode;
    const Router = this._Router;

    const root = createRoot(document.querySelector(selector)!);

    root.render(
      <ErrorsContext.Provider value={this._globalErrorsManager}>
        <Router basename={this._config.basePath}>
          <DiContainerProvider value={this._container}>
            <AppContext.Provider value={appContext}>
              <PathsContext.Provider value={this._paths}>
                <RootNode />
              </PathsContext.Provider>
            </AppContext.Provider>
          </DiContainerProvider>
        </Router>
      </ErrorsContext.Provider>,
    );
  }

  private _extractPathsFromRoutes(routes: Array<RouteObject>): Array<string> {
    return routes.reduce((memo, route) => {
      if (route.path == null) return memo;
      return [...memo, route.path, ...this._extractPathsFromRoutes(route.children ?? [])];
    }, [] as Array<string>);
  }
}
