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
    console.log('AuthGuard::canActivate', '(returns true)');
    return false;
  }

  public didNotActivate(): void {
    console.log('AuthGuard::didNotActivate', '(throws AuthError)');
    throw new AuthError();
  }
}

@Catch(AuthError)
class AuthErrorHandler implements ErrorHandler {
  constructor(private readonly _router: RouterService) {}

  public catch(): void {
    console.log('AuthErrorHandler::catch', '(redirects to login)');
    this._router.push('/login');
  }
}

const MainView = () => {
  console.log('MainView::render');
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

@Controller({ view: MainView, guards: [], handlers: [AuthErrorHandler] })
class MainController {}

const LoginView = () => {
  console.log('LoginView::render');
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
  console.log('ChildView::render');
  return <h1>Child View</h1>;
};

@Controller({ view: ChildView, guards: [AuthGuard], handlers: [] })
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
