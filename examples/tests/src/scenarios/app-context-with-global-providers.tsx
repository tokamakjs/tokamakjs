/* eslint-disable no-console */

/**
 * This example demonstrates how to use global providers
 * to make the app context available in places where we
 * cannot use the regular useAppContext() hook.
 */

import {
  Controller,
  React,
  SubApp,
  TokamakApp,
  createRoute,
  inject,
  useController,
} from '@tokamakjs/react';

const APP_CONTEXT = Symbol('APP_CONTEXT_INJECTION_TOKEN');

interface AppContext {
  foo: 'foo';
}

const MainView = () => {
  const ctrl = useController<MainController>();
  return <div>{ctrl.foo}</div>;
};

@Controller({ view: MainView })
class MainController {
  get foo() {
    return this._appContextProvider.foo;
  }

  constructor(@inject(APP_CONTEXT) private readonly _appContextProvider: AppContext) {}
}

@SubApp({
  routing: [createRoute('/', MainController)],
  providers: [],
  imports: [],
})
class App {}

async function bootstrap() {
  const appContext: AppContext = {
    foo: 'foo',
  };

  const app = await TokamakApp.create(App, {
    globalProviders: [{ provide: APP_CONTEXT, useValue: appContext }],
  });

  app.render('#root');
}

bootstrap();
