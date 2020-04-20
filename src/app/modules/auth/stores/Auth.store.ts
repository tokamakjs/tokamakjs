// import { AuthApi } from '../api/Auth.api';

import { injectable } from 'vendor/tokamak';

@injectable()
export class AuthStore {
  // constructor(private readonly api: AuthApi) {}

  async login(username: string, password: string): Promise<string> {
    // return await this.api.login(username, password);
    console.log(username);
    console.log(password);
    return Promise.resolve('token');
  }
}
