import { Query } from '@datorama/akita';
import { injectable } from 'vendor/tokamak';

import { AuthApi } from '../api';
import { AuthState, AuthStore } from '../stores';

@injectable()
export class AuthQuery extends Query<AuthState> {
  isLoading$ = this.selectLoading();

  constructor(protected readonly store: AuthStore, private readonly api: AuthApi) {
    super(store);
  }

  async login(username: string, password: string): Promise<string> {
    this.store.setLoading(true);
    const authToken = await this.api.login(username, password);
    this.store.update({ authToken });
    this.store.setLoading(false);
    return authToken;
  }
}
