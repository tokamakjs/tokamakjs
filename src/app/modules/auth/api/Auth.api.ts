import { injectable } from 'vendor/tokamak';

@injectable()
export class AuthApi {
  async login(username: string, password: string): Promise<string> {
    console.log(username);
    console.log(password);
    return new Promise((resolve) => {
      setTimeout(() => resolve('token'), 2000);
    });
  }
}
