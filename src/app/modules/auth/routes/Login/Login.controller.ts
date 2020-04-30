import { computed } from 'mobx';
import { controller } from 'vendor/tokamak';

import { AuthStore } from '../../stores/Auth.store';

@controller()
export class LoginController {
  constructor(private readonly authStore: AuthStore) {}

  @computed
  get isLoading() {
    return this.authStore.isLoginIn;
  }

  async login(username: string, password: string): Promise<string> {
    return await this.authStore.login(username, password);
  }
}
