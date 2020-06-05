import { OnDidMount, RouterService, controller, observable } from 'vendor/tokamak';

import { AuthGuard } from '~/modules/auth/guards';
import { AuthQuery } from '~/modules/auth/queries';
import { CurrentUserQuery } from '~/modules/auth/queries/current-user.query';

import { ProjectsQuery } from '../../queries';
import { Project } from '../../types';
import { HomeView } from './home.view';

@controller({ view: HomeView, guards: [AuthGuard] })
export class HomeController implements OnDidMount {
  @observable authToken?: string;
  @observable currentUser?: { firstName: string; lastName: string };
  @observable projects: Array<Project> = [];
  @observable isLoading: boolean = true;

  constructor(
    private readonly authQuery: AuthQuery,
    private readonly currentUserQuery: CurrentUserQuery,
    private readonly router: RouterService,
    private readonly projectsQuery: ProjectsQuery,
  ) {}

  onDidMount() {
    this.projectsQuery.loadProjects();

    const authTokenSub = this.authQuery.authToken$.subscribe((v) => (this.authToken = v));
    const currentUserSub = this.currentUserQuery.currentUser$.subscribe(
      (v) => (this.currentUser = v),
    );
    const isLoadingSub = this.projectsQuery.isLoading$.subscribe((v) => (this.isLoading = v));
    const projectsSub = this.projectsQuery.projects$.subscribe((v) => (this.projects = v));

    return () => {
      authTokenSub.unsubscribe();
      currentUserSub.unsubscribe();
      isLoadingSub.unsubscribe();
      projectsSub.unsubscribe();
    };
  }

  logout() {
    this.authQuery.logout();
    this.router.push('/auth/login');
  }
}
