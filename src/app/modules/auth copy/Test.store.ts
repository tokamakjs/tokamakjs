import { Query, Store, StoreConfig } from '@datorama/akita';
import { delay, injectable } from 'vendor/tokamak';

export interface AuthState {
  authToken?: string;
}

function getInitialState() {
  return {
    authToken: undefined,
  };
}

@injectable()
@StoreConfig({ name: 'auth', resettable: true })
export class TestStore extends Store<AuthState> {
  constructor() {
    super(getInitialState());
  }
}

@injectable()
export class TestService {
  constructor(private readonly authStore: TestStore) {}

  public async login(): Promise<string> {
    this.authStore.setLoading(true);
    console.log('set is loading');
    await delay(2000);
    this.authStore.setLoading(false);
    console.log('set is not loading');
    return 'token';
  }

  public logout(): void {
    this.authStore.reset();
  }
}

@injectable()
export class TestQuery extends Query<AuthState> {
  public readonly authToken$ = this.select('authToken');
  public readonly isLoading$ = this.selectLoading();

  constructor(protected readonly store: TestStore) {
    super(store);
  }
}
