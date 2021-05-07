/* eslint-disable no-console, jest/no-disabled-tests, jest/expect-expect */

import 'reflect-metadata';

import { AuthError, Catch, ErrorHandler, Guard, RouterService, delay } from '@tokamakjs/common';
import {
  Controller,
  HookService,
  Injectable,
  Link,
  Outlet,
  RouterModule,
  SubApp,
  TokamakApp,
  createRoute,
  state,
  useController,
} from '@tokamakjs/react';
import React from 'react';
import * as RX from 'rxjs';

// class AuthError extends Error {}

class NotFoundError extends Error {}

@Injectable()
class AuthStore {
  private readonly _token$ = new RX.BehaviorSubject<string | undefined>(
    localStorage.getItem('token') ?? undefined,
  );

  get token() {
    return this._token$.value;
  }

  get token$() {
    return this._token$;
  }

  public login() {
    this._token$.next('token');
    localStorage.setItem('token', 'token');
  }

  public logout() {
    this._token$.next(undefined);
    localStorage.removeItem('token');
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
    return this._service.token != null;
  }

  public didNotActivate(): void {
    throw new AuthError();
  }
}

const MainView = () => {
  const ctrl = useController<MainController>();

  return (
    <div>
      <h1>Main View</h1>
      <h2>Counter: {ctrl.counter}</h2>
      <p>
        <button onClick={() => ctrl.increase()}>Increase</button>
      </p>
      <p>
        <button onClick={() => ctrl.logout()}>Log out</button>
      </p>
      <p>
        <button onClick={() => ctrl.triggerNotFound()}>Trigger Not Found</button>
      </p>
      <Link href="/12">Go to child</Link>
      <Outlet />
    </div>
  );
};

@Catch(AuthError)
class AuthErrorHandler implements ErrorHandler {
  constructor(private readonly _router: RouterService) {}

  public catch(error: AuthError): void {
    this._router.push('/login');
  }
}

@Catch(NotFoundError)
class NotFoundErrorHandler implements ErrorHandler {
  // private readonly _alerts = useAlerts();

  public catch(error: Error): void {
    alert('Oh oh');
    // this._alerts.show('Oh oh');
  }
}

@Catch(NotFoundError)
class NotFoundErrorHandler2 implements ErrorHandler {
  public catch(error: Error): void {
    alert('Oh oh 2');
  }

  public render() {
    return (
      <div>
        <h1>Not Found</h1>
      </div>
    );
  }
}

@Catch(NotFoundError)
class NotFoundErrorHandler3 implements ErrorHandler {
  public catch(error: Error): void {
    alert('Oh oh 3');
  }

  public render() {
    return (
      <div>
        <h1>Not Found</h1>
      </div>
    );
  }
}

@Controller({
  view: MainView,
  guards: [AuthGuard],
  handlers: [AuthErrorHandler, NotFoundErrorHandler, NotFoundErrorHandler2],
})
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

  public triggerNotFound(): void {
    throw new NotFoundError('Not Found');
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

const ChildView = () => {
  // simulate a rendering error
  throw new NotFoundError();
};

@Controller({ view: ChildView, handlers: [NotFoundErrorHandler3] })
class ChildController {}

@SubApp({
  routing: [
    createRoute('/', MainController, [createRoute('/:id', ChildController)]),
    createRoute('/login', LoginController, []),
  ],
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
