import { computed } from 'mobx';
import { controller } from 'vendor/tokamak';

import { AuthGuard } from '~/modules/auth/guards';
import { AuthStore } from '~/modules/auth/stores';
import { CurrentUserStore } from '~/modules/auth/stores/CurrentUser.store';

import { ProjectsStore } from '../../stores';
import { HomeView } from './Home.view';

@controller({ view: HomeView, guards: [AuthGuard] })
export class HomeController {
  constructor(
    private readonly currentUserStore: CurrentUserStore,
    private readonly authStore: AuthStore,
    private readonly projectsStore: ProjectsStore,
  ) {
    // TODO: We need an onRender callback on controllers since
    // they're gonna be instantiated before any route is visible
  }

  @computed
  get isLoading() {
    return this.projectsStore.isLoading;
  }

  @computed
  get currentUser() {
    return this.currentUserStore.currentUser;
  }

  @computed
  get projects() {
    return this.projectsStore.projects;
  }

  public logout(): void {
    return this.authStore.logout();
  }

  // TODO: replace by an onRender/onMounted/onVisible callback
  public loadProjects(): void {
    if (!this.isLoading) {
      this.projectsStore.loadProjects();
    }
  }
}
