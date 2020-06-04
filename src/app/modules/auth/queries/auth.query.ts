import { Query } from '@datorama/akita';
import { OnModuleInit, injectable } from 'vendor/tokamak';

import { AuthApi } from '../api';
import { LocalStorageService } from '../services';
import { AuthState, AuthStore } from '../stores';

@injectable()
export class AuthQuery extends Query<AuthState> implements OnModuleInit {
  isLoading$ = this.selectLoading();
  authToken$ = this.select('authToken');

  constructor(
    protected readonly store: AuthStore,
    private readonly api: AuthApi,
    private readonly storageService: LocalStorageService,
  ) {
    super(store);
  }

  onModuleInit() {
    const authToken = this.storageService.getAuthToken();
    this.store.update({ authToken });
  }

  async login(username: string, password: string): Promise<string> {
    this.store.setLoading(true);
    const authToken = await this.api.login(username, password);
    this.storageService.saveAuthToken(authToken);
    this.store.update({ authToken });
    this.store.setLoading(false);
    return authToken;
  }

  logout(): void {
    this.store.reset();
    this.storageService.deleteAuthToken();
  }
}
