import { computed } from 'mobx';
import { controller } from 'vendor/tokamak';

import { AuthStore } from '~/modules/auth/stores';
import { CurrentUserStore } from '~/modules/auth/stores/CurrentUser.store';

import { HomeView } from './Home.view';

@controller({ view: HomeView })
export class HomeController {
  constructor(
    private readonly currentUserStore: CurrentUserStore,
    private readonly authStore: AuthStore,
  ) {}

  @computed
  get currentUser() {
    return this.currentUserStore.currentUser;
  }

  public logout(): void {
    return this.authStore.logout();
  }
}
