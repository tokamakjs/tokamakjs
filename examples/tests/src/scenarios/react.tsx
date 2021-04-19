import { delay, tracked } from '@tokamakjs/common';
import {
  Controller,
  Injectable,
  Outlet,
  RouterModule,
  SubApp,
  TokamakApp,
  createRedirection,
  createRoute,
  onDidMount,
  onDidRender,
  state,
  useAppContext,
  useController,
} from '@tokamakjs/react';
import React from 'react';

@Injectable()
export class ServiceA {
  public readonly id = 'ServiceA';
}

@Controller()
export class TestControllerA {
  @state public value: number = 0;

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

export const TestViewA = () => {
  const ctrl = useController(TestControllerA);
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

@Controller()
export class TestControllerB {
  @state public isLoading = false;

  constructor(public readonly serviceA: ServiceA) {}

  @onDidMount()
  public onDidMount(): void {
    console.log('TestControllerB :: onDidMount');
  }

  @onDidRender()
  public onDidRender(): void {
    console.log('TestControllerB :: onDidRender');
  }

  @tracked((self: TestControllerB, v) => (self.isLoading = v))
  public async doSomethingAsync(): Promise<void> {
    await delay(1000);
  }
}

export const TestViewB = () => {
  const appContext = useAppContext() as { hello: string };
  const ctrl = useController(TestControllerB);

  if (ctrl.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>TestViewB</h1>
      <h2>ServiceA: {ctrl.serviceA.id}</h2>
      <h3>App Context:</h3>
      <pre>{JSON.stringify(appContext, null, 2)}</pre>
      <button onClick={() => ctrl.doSomethingAsync()}>Do Something Async</button>
    </div>
  );
};

@SubApp({
  providers: [ServiceA],
  routing: [
    createRoute('/test-a', TestViewA, [createRoute('/test-b', TestViewB)]),
    createRoute('/test-b', TestViewB),
    createRedirection('/', '/my-basepath/test-a'),
  ],
  imports: [RouterModule],
})
export class TestModule {}

async function test() {
  const app = await TokamakApp.create(TestModule, {
    historyMode: 'hash',
    basePath: '/my-basepath',
  });

  app.render('#root', { hello: 'world' });
}

test();
