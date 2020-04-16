import { AuthApi } from '../api/Auth.api';

export class AuthStore {
  constructor(private readonly api: AuthApi) {}

  async login(username: string, password: string): Promise<string> {
    return await this.api.login(username, password);
  }
}
