// @ts-nocheck

class LoginFacade {
  private readonly _username = useSimpleState();
  private readonly _password = useSimpleState();
  private readonly _authToken: string;

  constructor() {
    const authQuery = useQuery(AuthQuery);
    this._authToken = useObservable(authQuery.authToken$);
  }

  get username() {
    return this._username.get();
  }

  get password() {
    return this._password.get();
  }

  login(username?: string, password?: string) {}
}

export function useLoginFacade() {
  return new LoginFacade();
}
