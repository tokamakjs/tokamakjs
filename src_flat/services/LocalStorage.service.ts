import { injectable } from '../guards/node_modules/vendor/tokamak';

@injectable()
export class LocalStorageService {
  static LS_TOKEN_KEY = 'LS_TOKEN_KEY';

  public saveAuthToken(token: string): void {
    localStorage.setItem(LocalStorageService.LS_TOKEN_KEY, token);
  }

  public getAuthToken(): string | undefined {
    return localStorage.getItem(LocalStorageService.LS_TOKEN_KEY) ?? undefined;
  }

  public deleteAuthToken(): void {
    localStorage.removeItem(LocalStorageService.LS_TOKEN_KEY);
  }
}
