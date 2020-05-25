import { Query, Store, StoreConfig } from '@datorama/akita';
import { OnInit, injectable } from 'vendor/tokamak';

import { AuthApi } from '../api/Auth.api';
import { LocalStorageService } from '../services';

export interface AuthState {
  authToken?: string;
}

@injectable()
@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<AuthState> {
  static initialState = {
    authToken: undefined,
  };

  constructor() {
    super(AuthStore.initialState);
  }

  // @preUpdate()
  // beforeUpdate() {
  //   // Run before we update
  // }
}

@injectable()
export class AuthService implements OnInit {
  constructor(
    private readonly api: AuthApi,
    private readonly storageService: LocalStorageService,
    private readonly authStore: AuthStore,
  ) {}

  onModuleInit() {
    const authToken = this.storageService.getAuthToken();
    this.authStore.update({ authToken });
  }

  public async login(username: string, password: string): Promise<string> {
    this.authStore.setLoading(true);
    const token = await this.api.login(username, password);
    this.storageService.saveAuthToken(token);
    this.authStore.update({ authToken: token });
    this.authStore.setLoading(false);
    return token;
  }

  public logout(): void {
    this.storageService.deleteAuthToken();
    this.authStore.reset();
  }
}

@injectable()
export class AuthQuery extends Query<AuthState> {
  public readonly authToken$ = this.select('authToken');
  public readonly isLoading$ = this.selectLoading();

  constructor(protected readonly store: AuthStore) {
    super(store);
  }
}
