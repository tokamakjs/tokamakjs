import { AuthStore } from '../../stores/Auth.store';

export class LoginController {
  constructor(private readonly authStore: AuthStore) {}

  get isLoading() {
    return false;
  }

  async login(username: string, password: string): Promise<string> {
    return await this.authStore.login(username, password);
  }
}
