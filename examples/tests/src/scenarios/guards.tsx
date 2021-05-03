import { Guard, RouterService, delay } from '@tokamakjs/common';
import {
  Controller,
  HookService,
  Injectable,
  RouterModule,
  SubApp,
  TokamakApp,
  createRoute,
  state,
  useController,
} from '@tokamakjs/react';
import React from 'react';
import * as RX from 'rxjs';

class AuthError extends Error {}

@Injectable()
class AuthStore {
  private readonly _token$ = new RX.BehaviorSubject<string | undefined>(undefined);

  get token() {
    return this._token$.value;
  }

  get token$() {
    return this._token$;
  }

  public login() {
    this._token$.next('token');
  }

  public logout() {
    this._token$.next(undefined);
  }
}

@Injectable()
class AuthService {
  get token() {
    return this._store.token;
  }

  get token$() {
    return this._store.token$;
  }

  constructor(private readonly _store: AuthStore) {}

  public login() {
    this._store.login();
  }

  public logout() {
    this._store.logout();
  }
}

@HookService()
class AuthGuard implements Guard {
  constructor(private readonly _service: AuthService, private readonly _router: RouterService) {}

  public canActivate(): boolean {
    return this._service.token != null;
  }

  public didNotActivate(): void {
    this._router.push('/login');
  }
}

@HookService()
class AsyncGuard implements Guard {
  constructor(private readonly _service: AuthService, private readonly _router: RouterService) {}

  public async canActivate(): Promise<boolean> {
    await delay(1000);
    console.log(this._service.token);
    return this._service.token != null;
  }

  public didNotActivate(): void {
    this._router.push('/login');
  }
}

const MainView = () => {
  const ctrl = useController<MainController>();
  return (
    <div>
      <h1>Main View</h1>
      <h2>Counter: {ctrl.counter}</h2>
      <button onClick={() => ctrl.increase()}>Increase</button>
    </div>
  );
};

// @Catch(AuthError)
// class AuthErrorFilter {
//   constructor(private readonly _router: RouterService) {}

//   public catch(error: Error): void {
//     this._router.push('/login');
//   }

//   // this is not required
//   public render() {
//     return <div>Unauthorized</div>;
//   }
// }

@Controller({ view: MainView, guards: [AsyncGuard] })
//@UseFilters(AuthErrorFilter)
class MainController {
  @state private _counter = 0;

  get counter() {
    return this._counter;
  }

  constructor(private readonly _service: AuthService, private readonly _router: RouterService) {}

  public increase() {
    this._counter += 1;
  }

  public logout(): void {
    this._service.logout();
    this._router.push('/login');
  }
}

const LoginView = () => {
  const ctrl = useController<LoginController>();
  return (
    <div>
      <h1>Login View</h1>
      <button onClick={() => ctrl.login()}>Login</button>
    </div>
  );
};

@Controller({ view: LoginView })
class LoginController {
  constructor(private readonly _service: AuthService, private readonly _router: RouterService) {}

  public login(): void {
    this._service.login();
    this._router.push('/');
  }
}

@SubApp({
  routing: [createRoute('/', MainController, []), createRoute('/login', LoginController, [])],
  providers: [AuthGuard, AsyncGuard, AuthStore, AuthService],
  imports: [RouterModule],
})
class AppModule {}

async function test() {
  const app = await TokamakApp.create(AppModule);
  app.render('#root');
}

test();
