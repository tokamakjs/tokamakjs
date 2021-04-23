import { RouterService } from '@tokamakjs/common';
import {
  Controller,
  HookService,
  Link,
  RouterModule,
  SubApp,
  TokamakApp,
  createRedirection,
  createRoute,
  effect,
  inject,
  onDidMount,
  onDidRender,
  ref,
  state,
  useController,
  useLocation,
  useParams,
  useResolve,
} from '@tokamakjs/react';
import React from 'react';

@HookService()
class TransitiveHookService {
  private readonly _location = useLocation();

  get location() {
    return this._location;
  }
}

@HookService()
class MyHookService {
  private readonly _params = useParams();

  get params() {
    return this._params;
  }

  get trans() {
    return this._trans;
  }

  constructor(private readonly _trans: TransitiveHookService) {}
}

@Controller()
class MainController {
  @state private _value = 0;
  @ref private _refValue = 0;
  @state private _name = 'Main';

  private readonly _service = useResolve(MyHookService);

  get params() {
    return this._myService?.params ?? {};
  }

  get location() {
    return this._myService.trans.location;
  }

  get value() {
    return this._value;
  }

  get refValue() {
    return this._refValue;
  }

  get name() {
    return this._name;
  }

  constructor(
    @inject('ANOTHER') private readonly _another: string,
    @inject('TOKEN') private readonly _token: string,
    private readonly _myService: MyHookService,
    private readonly _router: RouterService,
  ) {}

  @onDidMount()
  public onDidMount() {
    console.log('MainController::onDidMount');
    console.log(this._another);
    console.log(this._token);
    console.log(this._service);
    console.log(this._router);
  }

  @onDidRender()
  public onDidRender() {
    console.log('MainController::onDidRender');
    return () => {
      console.log('MainController::onWillUpdate');
    };
  }

  @effect((self: MainController) => [self.name])
  public onNameDidChange() {
    console.log('MainController::onNameDidChange');
  }

  public increase(): void {
    this._value += 1;
    this._refValue += 1;
  }

  public changeName(): void {
    this.increase();
    this._name = this._name + '-';
    this.decrease();
  }

  public decrease(): void {
    if (this._value === 0) {
      console.warn('Not below zero');
    }

    this._value -= 1;
  }
}

const MainView = () => {
  const ctrl = useController(MainController);
  return (
    <div>
      <h1>Main View</h1>
      <h2>Value: {ctrl.value}</h2>
      <h2>Ref Value: {ctrl.refValue}</h2>
      <h2>Name: {ctrl.name}</h2>
      <h2>Param id: {ctrl.params.id}</h2>
      <h2>Location: {ctrl.location.pathname}</h2>
      <br />
      <button onClick={() => ctrl.increase()}>Increase</button>
      <br /> <br />
      <button onClick={() => ctrl.changeName()}>Change Name</button>
      <br /> <br />
      <Link href="/secondary">Go to secondary</Link>
    </div>
  );
};

const SecondaryView = () => {
  return (
    <div>
      <h1>Secondary View</h1>
      <Link href="/">Back to main</Link>
    </div>
  );
};

@SubApp({
  routing: [
    createRoute('/:id', MainView),
    createRedirection('/', '/1'),
    createRoute('/secondary', SecondaryView),
  ],
  providers: [
    MyHookService,
    { useFactory: async () => 'hello', provide: 'TOKEN' },
    { useValue: 'another', provide: 'ANOTHER' },
    TransitiveHookService,
  ],
  imports: [RouterModule],
})
class App {}

async function bootstrap() {
  const app = await TokamakApp.create(App);
  app.render('#root');
}

bootstrap();
