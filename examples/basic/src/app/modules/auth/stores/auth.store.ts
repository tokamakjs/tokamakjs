import { Store, StoreConfig } from '@datorama/akita';

export interface AuthState {
  authToken?: string;
}

function getInitialState(): AuthState {
  return { authToken: undefined };
}

@StoreConfig({ name: 'auth', resettable: true })
export class AuthStore extends Store<AuthState> {
  constructor() {
    super(getInitialState());
  }
}
