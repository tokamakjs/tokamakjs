import { computed } from 'mobx';
import { RouterService, controller } from 'vendor/tokamak';

import { AuthStore } from '~/modules/auth/stores';

import { LoginView } from './Login.view';

@controller({ view: LoginView })
export class LoginController {
  constructor(private readonly authStore: AuthStore, private readonly router: RouterService) {}

  @computed
  get isLoading() {
    return this.authStore.isLoginIn;
  }

  async login(username: string, password: string): Promise<void> {
    await this.authStore.login(username, password);
    this.router.push('/');
  }
}
