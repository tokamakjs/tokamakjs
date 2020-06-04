import { computed } from 'mobx';
import { OnDidMount, OnDidRender, OnWillUnmount, controller, tracked } from 'vendor/tokamak';

import { AuthGuard } from '~/modules/auth/guards';
import { AuthStore } from '~/modules/auth/stores';
import { CurrentUserStore } from '~/modules/auth/stores/CurrentUser.store';

import { ProjectsStore } from '../../stores';
import { HomeView, HomeViewError, HomeViewLoading } from './Home.view';

@controller({
  view: HomeView,
  states: {
    loading: HomeViewLoading,
    error: HomeViewError,
  },
  guards: [AuthGuard],
})
export class HomeController implements OnDidMount, OnWillUnmount, OnDidRender {
  constructor(
    private readonly currentUserStore: CurrentUserStore,
    private readonly authStore: AuthStore,
    private readonly projectsStore: ProjectsStore,
  ) {}

  @tracked
  public async onDidMount(): Promise<void> {
    await this.projectsStore.loadProjects();
  }

  public onWillUnmount(): void {
    console.log('Unmounted HomeController');
  }

  public onDidRender(): void {
    console.log('Render HomeController');
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
}
