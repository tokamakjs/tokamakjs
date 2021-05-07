# TokamakJS

A semi-opinionated framework to build web applications using the latest tools in the React ecosystem. Heavily inspired by [NestJS](https://docs.nestjs.com/).

## Getting Started

The easiest way to get started with *TokamakJS* is to simply install its CLI using:

```bash
$ npm i -g @tokamakjs/cli
```

And once that's done, run the following command:

```bash
$ tok new app-name
```

This will create a new *TokamakJS* app in the `app-name` dir.

## Simple Example

The following example goes briefly over some of the most important concepts in a *TokamakJS* app.

```tsx
import { Catch, ErrorHandler, Guard, RouterService, delay } from '@tokamakjs/common';
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
  effect,
  onDidMount,
  onDidRender,
  ref,
  state,
  useAppContext,
  useController,
} from '@tokamakjs/react';
import React from 'react';

interface AppContext {
  hello: string;
}

class AuthError extends Error {
  public readonly code = 'AUTH_ERROR';
}

/**
 * Services are regular ES6 clases anotated with @Injectable() or
 * @HookService() and added to the providers array of a sub-app or module.
 * Usually, they will contain most of your business logic and will take care
 * of interacting with the outside world.
 *
 * As mentioned before, there are two types of services:
 *
 *  - Annotated with @Injectable(): They are instantiated when the app
 *    is created and behave like singletons (this behavior can be changed
 *    setting the scope)
 *
 *  - Annotated with @HookService(): They are instantiated when the controller
 *    requiring them is instantiated and are a safe place to use React decorators
 *    like @state(), @ref(), @effect(), etc.
 */
@Injectable()
class AuthService {
  private readonly _token = 'token';

  public getToken(): string | undefined {
    return undefined;
  }
}

@HookService()
class CounterHookService {
  @state private _value = 0; // equivalent to useState()

  get value() {
    return this._value;
  }

  public increase(): void {
    this._value += 1;
  }

  public decrease(): void {
    this._value -= 1;
  }
}

/**
 * Guards run before a route is rendered and take care of
 * checking if the route can be "activated" (rendered) or not.
 *
 * They must be decorated with @Injectable() and implement the
 * Guard interface.
 */
@Injectable()
class AuthGuard implements Guard {
  /**
   * Good ol' dependency injection
   */
  constructor(private readonly _authService: AuthService) {}

  /**
   * This method is required and can either run
   * synchronously or asynchronously. If it returns
   * false, then, the route won't be rendered and an
   * blank route will be rendered instead.
   */
  public async canActivate(): Promise<boolean> {
    await delay(500);
    return this._authService.getToken() != null;
  }

  /**
   * This method will be called if the route was
   * activated. It's not required.
   */
  public didActivate(): void {
    console.log('I could activate');
  }

  /**
   * This method will be called if the route was not
   * activated. It's not required.
   */
  public didNotActivate(): void {
    throw new AuthError();
  }
}

/**
 * Views are just regular React components.
 */
const MainView = () => {
  // With useController() hook we can access the Controller
  // assigned to this view.
  const ctrl = useController<MainController>();

  return (
    <div>
      <h1>Main View</h1>
      <h2>Counter: {ctrl.counter}</h2>
      <h2>CounterService: {ctrl.counterService.value}</h2>
      <h2>CounterRef: {ctrl.counterRef}</h2>
      <p>
        <button onClick={() => ctrl.increase()}>Increase</button>
      </p>
      <p>
        <button onClick={() => ctrl.counterService.increase()}>Increase service</button>
      </p>
      <p>
        <button onClick={() => ctrl.increaseRef()}>Increase ref</button>
      </p>
      <p>
        <Link href="/12">To child</Link>
      </p>
      <Outlet />
    </div>
  );
};

/**
 * Error handlers take care of catching errors of the type
 * specified in the @Catch() decorator.
 *
 * Apart from being decorated with @Catch() they must also
 * implement the ErrorHandler interface.
 *
 * They take some inspiration from React's own error boundaries
 * and as such, they let to either just react to the error or render
 * a fallback UI.
 */
@Catch(AuthError)
class AuthErrorHandler implements ErrorHandler {
  /**
   * Regular dependency injection can be used inside error handlers
   */
  constructor(private readonly _router: RouterService) {}

  /**
   * Implement this method if you want to handle the error but
   * are not interested in rendering a fallback UI.
   */
  public catch(): void {
    this._router.push('/login');
  }
}

@Catch(AuthError)
class AltAuthErrorHandler implements ErrorHandler<AuthError> {
  /**
   * Implement this method if you want to render a fallback UI.
   */
  public render(error: AuthError) {
    return <h1>{error.code} - Unauthorized</h1>;
  }
}

/**
 * Controllers take care of rendering a react component as their view. This React
 * component is just a regular React component with nothing special in it.
 *
 * They also accept an array of guards that will run before this controller's view is
 * rendered in orther to check that it can effectively be rendered. Guards are evaluated
 * from left to right so that'd be the order of execution of their respective life-cycle methods.
 *
 * Finally, an array of error handlers can also be provided to react to any kind of error
 * triggered in the context of this controller's route (including children). Error handlers
 * are evaluated from right to left and only the first one to catch the error will be run.
 *
 * Also important, guards from parents have priority over those of the children and error handlers
 * from children have priority over those of the parent.
 */
@Controller({ view: MainView, guards: [AuthGuard], handlers: [AuthErrorHandler] })
class MainController {
  @state private _counter = 0; // this behaves like useState()
  @ref private _counterRef = 0; // this behaves like useRef()

  get counter() {
    return this._counter;
  }

  get counterRef() {
    return this._counterRef;
  }

  /**
   * Controller can also access the IoC container.
   */
  constructor(public readonly counterService: CounterHookService) {}

  /**
   * We can attach methods to the different react life-cycle hooks
   * using @onDidMount(), @onDidRender() and @effect()
   */
  @onDidMount()
  public mainDidMount(): VoidFunction {
    console.log('MainController::mainDidMount');

    return () => {
      console.log('MainController::mainWillUnmount');
    };
  }

  @onDidRender()
  public mainDidRender(): VoidFunction {
    console.log('MainController::mainDidRender');

    return () => {
      console.log('MainController::mainWillUpdate');
    };
  }

  @effect((self: MainController) => [self.counter])
  public counterDidChange(): VoidFunction {
    console.log('MainController::counterDidChange');

    return () => {
      console.log('MainController::mainWillUpdate');
    };
  }

  public increase(): void {
    this._counter += 1; // this will trigger a re-rendering
  }

  public increaseRef(): void {
    this._counterRef += 1; // this will not trigger a re-rendering
  }
}

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

/**
 * Only the view argument is required in @Controller()
 */
@Controller({ view: LoginView })
class LoginController {}

const ChildView = () => {
  // global app context defined when creating the app
  const context = useAppContext<AppContext>();
  return (
    <div>
      <h1>Child View</h1>
      <h2>Context: {context.hello}</h2>
    </div>
  );
};

/**
 * REMEMBER: Guards from parents have priority over those of the children and error handlers
 * from children have priority over those of the parent.
 */
@Controller({ view: ChildView, guards: [AuthGuard], handlers: [AltAuthErrorHandler] })
class ChildController {}

/**
 * Finally, we put everything together inside @SubApp().
 *
 * It's possible to nest different sub-apps inside another sub-app leding to a
 * fractal architecture. To do so, simply import modules or sub-apps (and in the
 * case of sub-apps also include their routes with includeRoutes()).
 *
 * The only difference between a @Module() and a @SubApp() is that the first one only
 * encapsulates business logic while a sub-app also allows to have views (and therefore
 * needs routing.)
 */
@SubApp({
  routing: [
    createRoute('/', MainController, [createRoute('/:id', ChildController)]),
    createRoute('/login', LoginController),
  ],
  providers: [AuthGuard, AuthService, CounterHookService],
  imports: [RouterModule],
})
class MainApp {}

/**
 * Prepare the app, initialize stufff and then
 * render the newly created app.
 */
async function bootstrap() {
  const app = await TokamakApp.create(MainApp, {
    historyMode: 'browser', // optional, we can also use 'hash' or 'memory' here
    basePath: '', // optional, in case the app is not running from the root
  });

  app.render('#root', {
    // we can define a global app context that will be accessible
    // using the hook useAppContext()
    hello: 'world',
  });
}

// Finally, run the main function
bootstrap();
```

## LICENSE

[MIT](LICENSE)
