/* eslint-disable no-console */

/**
 * This example demonstrates how to use global providers
 * to make the app context available in places where we
 * cannot use the regular useAppContext() hook.
 */

import { Guard } from '@tokamakjs/common';
import {
  Controller,
  HookService,
  React,
  SubApp,
  TokamakApp,
  createRoute,
  inject,
  useController,
} from '@tokamakjs/react';

const APP_CONTEXT = Symbol('APP_CONTEXT_INJECTION_TOKEN');

interface AppContext {
  foo: 'foo' | 'bar';
}

@HookService()
class AuthGuard implements Guard {
  constructor(@inject(APP_CONTEXT) private readonly _appContext: AppContext) {}

  public canActivate(): boolean {
    return this._appContext.foo === 'bar';
  }
}

const MainView = () => {
  useController<MainController>();
  return <div>MAIN VIEW</div>;
};

@Controller({ view: MainView, guards: [AuthGuard] })
class MainController {}

@SubApp({
  routing: [createRoute('/', MainController)],
  providers: [AuthGuard],
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
