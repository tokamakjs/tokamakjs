import { autorun, observable } from 'mobx';
import { injectable } from 'vendor/tokamak';

import { AuthStore } from './Auth.store';

interface CurrentUser {
  firstName: string;
  lastName: string;
}

@injectable()
export class CurrentUserStore {
  @observable public currentUser?: CurrentUser;

  constructor(private readonly authStore: AuthStore) {
    autorun(() => {
      if (authStore.authToken == null) {
        this.currentUser = undefined;
      } else {
        this.currentUser = this.decodeAuthToken();
      }
    });
  }

  private decodeAuthToken(): CurrentUser | undefined {
    if (this.authStore.authToken == null) {
      return;
    }

    return JSON.parse(atob(this.authStore.authToken));
  }
}
