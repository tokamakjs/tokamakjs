import {
  EntityState,
  EntityStore,
  QueryEntity,
  StoreConfig,
  combineQueries,
} from '@datorama/akita';
import { delay, ze } from '@tokamakjs/common';
import {
  Controller,
  Injectable,
  Outlet,
  RouterModule,
  SubApp,
  TokamakApp,
  createRoute,
  onDidMount,
  state,
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
    await delay(2000);
    return ze.validate(UserDto, data);
  }
}

interface TestState extends EntityState<UserDto, number> {}

@Injectable()
@StoreConfig({ name: 'test' })
export class TestStore extends EntityStore<TestState> {}

@Injectable()
export class ServiceA extends QueryEntity<TestState> {
  public readonly id = 'ServiceA';

  public isLoading$ = this.selectLoading();
  public data$ = this.selectAll();

  constructor(protected _store: TestStore, public readonly api: TestApi) {
    super(_store);
  }

  public async fetchData(): Promise<void> {
    this.store.setLoading(true);

    const data = await this.api.fetchData();

    this.store.setLoading(false);
    this.store.add(data);
  }
}

export const TestViewA = () => {
  const ctrl = useController<TestControllerA>();

  console.log(ctrl.isLoading, ctrl.data);

  return (
    <div>
      <h1>TestViewA</h1>
      <h2>Data:</h2>
      {ctrl.isLoading ? 'Loading...' : <pre>{JSON.stringify(ctrl.data, undefined, 2)}</pre>}
    </div>
  );
};

@Controller({ view: TestViewA })
export class TestControllerA {
  @state public isLoading = true;
  @state public data: Array<UserDto> = [];

  constructor(public readonly serviceA: ServiceA) {}

  @onDidMount()
  public onDidMount() {
    // Use combine queries to listen to both changes at the same time
    combineQueries([this.serviceA.isLoading$, this.serviceA.data$]).subscribe(
      ([isLoading, data]) => {
        console.log('sub', isLoading, data);
        this.data = data;
        this.isLoading = isLoading;
      },
    );
  }

  @onDidMount()
  public fetchData() {
    this.serviceA.fetchData();
  }
}

@SubApp({
  providers: [ServiceA, TestApi, TestStore],
  routing: [createRoute('/', TestControllerA)],
  imports: [RouterModule],
})
export class TestModule {}

async function test() {
  const app = await TokamakApp.create(TestModule);
  app.render('#root');
}

test();
