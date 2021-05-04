import { ErrorHandler, Guard, RouterService, UseErrorHandlers, delay } from '@tokamakjs/common';
import { Class } from '@tokamakjs/injection';
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
import React, { ReactNode } from 'react';
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

function Catch<E extends Error>(e: Class<E>) {
  return <T extends ErrorHandler<E>>(Target: Class<T>) => {};
}

@Catch(AuthError)
class AuthErrorHandler implements ErrorHandler {
  constructor(private readonly _router: RouterService) {}

  public catch(error: AuthError): void {
    this._router.push('/login');
  }

  public render(): ReactNode {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }
}

// @Catch(AuthError)
// class AuthErrorFilter {
//   private readonly _alerts = useAlerts();

//   public catch(error: Error): void {
//     this._alerts.show('Oh oh');
//   }

//   public render() {
//     return <div>Unauthorized</div>;
//   }
// }

@Controller({ view: MainView, guards: [AsyncGuard] })
@UseErrorHandlers(AuthErrorHandler)
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

  // app.addGlobalErrorHandler(AuthErrorHandler);

  app.render('#root');
}

test();
