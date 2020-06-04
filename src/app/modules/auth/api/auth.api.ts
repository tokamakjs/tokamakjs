import { injectable } from 'vendor/tokamak';

@injectable()
export class AuthApi {
  async login(username: string, password: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(
        () => resolve(btoa(JSON.stringify({ firstName: username, lastName: 'Smith' }))),
        2000,
      );
    });
  }
}
