import {
  Controller,
  Injectable,
  Outlet,
  SubApp,
  TokamakApp,
  createRedirection,
  createRoute,
  observable,
  onDidMount,
  onDidRender,
  useAppContext,
} from '@tokamakjs/react';
import React from 'react';

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

  @onDidMount()
  public onDidMount() {
    console.log('TestControllerA :: onDidMount');
  }

  @onDidRender()
  public onDidRender() {
    console.log('TestControllerA :: onDidRender');
  }

  public increase() {
    this.value += 1;
  }
}

export const TestViewB = (ctrl: TestControllerB) => {
  const appContext = useAppContext() as { hello: string };
  return (
    <div>
      <h1>TestViewB</h1>
      <h2>ServiceA: {ctrl.serviceA.id}</h2>
      <h3>App Context:</h3>
      <pre>{JSON.stringify(appContext, null, 2)}</pre>
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
    createRedirection('/', '/test-a'),
  ],
})
export class TestModule {}

async function test() {
  const app = await TokamakApp.create(TestModule, {
    historyMode: 'hash',
  });

  app.setAppContext({ hello: 'world' });

  app.render('#root');
}

test();
