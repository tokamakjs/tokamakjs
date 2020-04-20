import { OnDidInit, OnInit, injectable } from 'vendor/tokamak';

import { AuthApi } from '../api/Auth.api';
import { LocalStorageService } from '../services';

@injectable()
export class AuthStore implements OnInit, OnDidInit {
  public isLoginIn = false;
  private _authToken?: string;

  constructor(
    private readonly api: AuthApi,
    private readonly storageService: LocalStorageService,
  ) {}

  onInit() {
    console.log('On init AuthStore');
    this._authToken = this.storageService.getAuthToken();
  }

  onDidInit() {
    console.log('On did init AuthStore');
  }

  async login(username: string, password: string): Promise<string> {
    this.isLoginIn = true;
    const token = await this.api.login(username, password);
    this._authToken = token;
    this.isLoginIn = true;
    return token;
  }
}
