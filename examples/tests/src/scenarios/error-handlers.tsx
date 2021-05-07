/* eslint-disable no-console, jest/no-disabled-tests, jest/expect-expect */

import { Catch, ErrorHandler, Guard, RouterService } from '@tokamakjs/common';
import {
  Controller,
  Injectable,
  Link,
  RouterModule,
  SubApp,
  TokamakApp,
  createRoute,
} from '@tokamakjs/react';
import React from 'react';

class AuthError extends Error {}

@Injectable()
class AuthGuard implements Guard {
  public canActivate(): boolean {
    console.log('AuthGuard::canActivate', '(returns false)');
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
  return <h1>Main View</h1>;
};

@Controller({ view: MainView, guards: [AuthGuard], handlers: [AuthErrorHandler] })
class MainController {}

const LoginView = () => {
  console.log('LoginView::render');
  return (
    <div>
      <h1>Login View</h1>
      <p>
        <Link href="/">Back to main</Link>
      </p>
    </div>
  );
};

@Controller({ view: LoginView })
class LoginController {}

@SubApp({
  routing: [createRoute('/', MainController), createRoute('/login', LoginController)],
  providers: [AuthGuard],
  imports: [RouterModule],
})
class MainApp {}

async function test() {
  const app = await TokamakApp.create(MainApp);
  app.render('#root');
}

test();
