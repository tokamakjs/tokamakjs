import { ReactElement } from 'react';
import { Controller, RouterService, controller } from 'vendor/tokamak';

import { AuthQuery, AuthService } from '~/modules/auth/stores';

import { LoginView } from './Login.view';

@controller({ view: LoginView })
export class LoginController extends Controller {
  @observed public readonly isLoading = this.authQuery.isLoading$;

  constructor(
    private readonly authService: AuthService,
    private readonly authQuery: AuthQuery,
    private readonly router: RouterService,
  ) {
    super();
  }

  async login(username: string, password: string): Promise<void> {
    await this.authService.login(username, password);
    this.router.push('/');
  }

  // re-run every time an observed property is updated

  // should we return a promise that is tracked by the router?
  // and the router would do render.isPending ? Loading : renderResult;
  async render(): Promise<ReactElement> {
    // run guards
    // return a ViewWrapped component to be able to use hooks
    // and since the controller is in charge of refreshing, no issue here
    // Problem: How to notify the router we're refreshing this? so it can
    // display the loading again
    // The router could pass down a forceUpdate/refresh function to the controllers
    // and they will call it before starting the rendering process
    // so every time a controller wants to be re-rendered, it just has to call refresh()
  }
}

/**
 * Router pseudo-code
 *
 * function Route() {
 *   const [, setState] = useState();
 *
 *   const forceUpdate = useCallback(() => setState(), []);
 *   controller.setRefreshFunction(forceUpdate);
 *
 *   const [isPending, result] = usePromise(controller.render);  // careful with infinite loops, need a way of mark it as already done
 *
 *   if (isPending) {
 *     return 'Loading...';
 *   }
 *
 *   return result;
 * }
 */

/**
 * Controllers could also have a onWillRender method that returns a promise
 * and it's used inside render()
 */

/**
 * So now, I just have to find a way to actually de-couple the controller with any
 * state management solution. Basically, the only thing I want is to be able to
 * track when one of the dependencies of the controller has been updated.
 */
