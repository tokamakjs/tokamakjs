import { action, observable } from 'mobx';
import { OnDidInit, OnInit, injectable } from 'vendor/tokamak';

import { AuthApi } from '../api/Auth.api';
import { LocalStorageService } from '../services';

@injectable()
export class AuthStore implements OnInit, OnDidInit {
  @observable public authToken?: string;
  @observable public isLoginIn = false;

  constructor(
    private readonly api: AuthApi,
    private readonly storageService: LocalStorageService,
  ) {}

  onInit() {
    console.log('On init AuthStore');
    this.authToken = this.storageService.getAuthToken();
  }

  onDidInit() {
    console.log('On did init AuthStore');
  }

  @action.bound
  public async login(username: string, password: string): Promise<string> {
    this.isLoginIn = true;
    const token = await this.api.login(username, password);
    console.log('AuthToken', token);
    this.storageService.saveAuthToken(token);
    this.authToken = token;
    this.isLoginIn = false;
    return token;
  }

  public logout(): void {
    this.storageService.deleteAuthToken();
    this.authToken = undefined;
  }
}
