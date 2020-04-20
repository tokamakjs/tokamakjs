import { injectable } from 'vendor/tokamak';

@injectable()
export class AuthApi {
  async login(username: string, password: string): Promise<string> {
    console.log(username);
    console.log(password);
    return Promise.resolve('token');
  }
}
