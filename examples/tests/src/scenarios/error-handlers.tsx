/* eslint-disable no-console, jest/no-disabled-tests, jest/expect-expect */

import { Catch, ErrorHandler, Guard, RouterService, delay } from '@tokamakjs/common';
import {
  Controller,
  Injectable,
  Link,
  Outlet,
  RouterModule,
  SubApp,
  TokamakApp,
  createRoute,
} from '@tokamakjs/react';
import React from 'react';

class AuthError extends Error {}

@Injectable()
class AuthGuard implements Guard {
  public async canActivate() {
    await delay(500);
    return false;
  }

  public didNotActivate(): void {
    throw new AuthError();
  }
}

@Catch(AuthError)
class AuthErrorHandler implements ErrorHandler {
  constructor(private readonly _router: RouterService) {}

  public catch(): void {
    this._router.push('/login');
  }
}

@Catch(AuthError)
class AltAuthErrorHandler implements ErrorHandler {
  public render() {
    return <h1>Unauthorized</h1>;
  }
}

const MainView = () => {
  return (
    <div>
      <h1>Main View</h1>
      <p>
        <Link href="/12">To child</Link>
      </p>
      <Outlet />
    </div>
  );
};

@Controller({ view: MainView, guards: [AuthGuard], handlers: [AuthErrorHandler] })
class MainController {}

const LoginView = () => {
  return (
    <div>
      <h1>Login View</h1>
      <p>
        <Link href="/">Back to main</Link>
      </p>
      <p>
        <Link href="/12">Back to child</Link>
      </p>
    </div>
  );
};

@Controller({ view: LoginView })
class LoginController {}

const ChildView = () => {
  return <h1>Child View</h1>;
};

@Controller({ view: ChildView, guards: [AuthGuard], handlers: [AltAuthErrorHandler] })
class ChildController {}

@SubApp({
  routing: [
    createRoute('/', MainController, [createRoute('/:id', ChildController)]),
    createRoute('/login', LoginController),
  ],
  providers: [AuthGuard],
  imports: [RouterModule],
})
class MainApp {}

async function test() {
  const app = await TokamakApp.create(MainApp);
  app.render('#root');
}

test();
