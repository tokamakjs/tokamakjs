import { Injectable } from '@tokamakjs/injection';
import React from 'react';

import { Controller, Outlet, SubApp, TokamakApp, createRoute, observable } from '../react';

@Injectable()
export class ServiceA {
  public readonly id = 'ServiceA';
}

export const TestViewA = (ctrl: TestControllerA) => {
  return (
    <div>
      <h1>TestViewA</h1>
      <h2>ServiceA: {ctrl.serviceA.id}</h2>
      <h2>Value: {ctrl.value}</h2>
      <button onClick={() => ctrl.increase()}>Increase value</button>
      <br />
      <br />
      <Outlet />
    </div>
  );
};

@Controller({ view: TestViewA })
export class TestControllerA {
  @observable public value: number = 0;

  constructor(public readonly serviceA: ServiceA) {}

  public increase() {
    this.value += 1;
  }
}

export const TestViewB = (ctrl: TestControllerB) => {
  return (
    <div>
      <h1>TestViewB</h1>
      <h2>ServiceA: {ctrl.serviceA.id}</h2>
    </div>
  );
};

@Controller({ view: TestViewB })
export class TestControllerB {
  constructor(public readonly serviceA: ServiceA) {}
}

@SubApp({
  providers: [ServiceA],
  routing: [
    createRoute('/test-a', TestControllerA, [createRoute('/test-b', TestControllerB)]),
    createRoute('/test-b', TestControllerB),
    createRoute('/', TestControllerA),
  ],
})
export class TestModule {}

async function test() {
  const app = await TokamakApp.create(TestModule, {
    historyMode: 'browser',
  });

  app.setAppContext({ hello: 'world' });

  app.render('#root');
}

test();
