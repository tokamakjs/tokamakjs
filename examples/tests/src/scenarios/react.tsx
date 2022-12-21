import { delay, tracked, ze } from '@tokamakjs/common';
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
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
});

// @ts-ignore Type instantiation is excessively deep and possibly infinite.
class UserDto extends ze.ClassFrom(UserSchema) {
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

@Injectable()
export class TestApi {
  public async fetchData(): Promise<UserDto> {
    const data: unknown = { id: 1, firstName: 'test', lastName: 'last' };
    return ze.validate(data, UserDto);
  }
}

@Injectable()
export class ServiceA {
  public readonly id = 'ServiceA';

  constructor(public readonly api: TestApi) {}

  public async fetchData(): Promise<void> {
    const data = await this.api.fetchData();
    console.log('api data', data.fullName);
  }
}

export const TestViewA = () => {
  const ctrl = useController<TestControllerA>();
  return (
    <div>
      <h1>TestViewA</h1>
      <h2>ServiceA: {ctrl.serviceA.id}</h2>
      <h2>Value: {ctrl.value}</h2>
      <button onClick={() => ctrl.increase()}>Increase value</button>
      <br />
      <br />
      <button onClick={() => ctrl.fetchData()}>Fetch data</button>
      <br />
      <br />
      <Outlet />
    </div>
  );
};

@Controller({ view: TestViewA })
export class TestControllerA {
  @state private _value: number = 0;

  get value() {
    return this._value;
  }

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
    this._value += 1;
  }

  public fetchData() {
    this.serviceA.fetchData();
  }
}

export const TestViewB = () => {
  const appContext = useAppContext() as { hello: string };
  const ctrl = useController<TestControllerB>();

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

@Controller({ view: TestViewB })
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

@SubApp({
  providers: [ServiceA, TestApi],
  routing: [
    createRoute('/test-a', TestControllerA, [createRoute('/test-b', TestControllerB)]),
    createRoute('/test-b', TestControllerB),
    createRedirection('/', '/test-a'),
  ],
  imports: [RouterModule],
})
export class TestModule {}

async function test() {
  const app = await TokamakApp.create(TestModule, {
    historyMode: 'hash',
  });

  app.render('#root', { hello: 'world' });
}

test();
