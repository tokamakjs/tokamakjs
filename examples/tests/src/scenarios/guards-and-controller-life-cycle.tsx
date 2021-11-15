/* eslint-disable no-console */

/**
 * This example demonstrates how the controller life-cycle hooks
 * are affected by guards.
 */

import { Guard } from '@tokamakjs/common';
import { Injectable } from '@tokamakjs/injection';
import {
  Controller,
  HookService,
  SubApp,
  TokamakApp,
  createRoute,
  onDidMount,
  state,
  useController,
} from '@tokamakjs/react';
import React from 'react';

// APP GUARDS
// ---------
@Injectable()
class AppGuard implements Guard {
  public canActivate(): boolean {
    return false; // NOTE: Change this to "true" OR "false" to check the behavior.
  }
}
// ----------

// APP SERVICES
// ------------
@HookService()
class CounterService {
  @state private _value = 0;

  get value() {
    return this._value;
  }

  @onDidMount()
  protected onDidMount(): void {
    // AppGuard returns false, so this should never be called
    console.warn('On onDidMount should not have been called.');
  }

  public increase(): void {
    this._value += 1;
  }
}
// ------------

// APP ROUTE
// ----------
const AppView = () => {
  const ctrl = useController<AppController>();
  return (
    <div>
      <div>Value: {ctrl.value}</div>
      <button onClick={() => ctrl.increase()}>Increase</button>
      <div>Service value: {ctrl.serviceValue}</div>
      <button onClick={() => ctrl.increaseService()}>Increase Service</button>
    </div>
  );
};

@Controller({ view: AppView, guards: [AppGuard] })
class AppController {
  @state private _value = 0;

  get value() {
    return this._value;
  }

  get serviceValue() {
    return this._counterService.value;
  }

  constructor(private readonly _counterService: CounterService) {}

  @onDidMount()
  protected onDidMount(): void {
    // AppGuard returns false, so this should never be called
    console.warn('On onDidMount should not have been called.');
  }

  public increase(): void {
    this._value += 1;
  }

  public increaseService(): void {
    this._counterService.increase();
  }
}
// ----------

// APP
// ---
@SubApp({ routing: [createRoute('/', AppController)], providers: [AppGuard, CounterService] })
class AppModule {}

async function bootstrap() {
  const app = await TokamakApp.create(AppModule);
  app.render('#root');
}

bootstrap();
// ---
