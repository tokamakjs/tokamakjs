import { OnDidMount, RouterService, controller, observable } from 'vendor/tokamak';

import { AuthGuard } from '~/modules/auth/guards';
import { AuthQuery } from '~/modules/auth/queries';
import { CurrentUserQuery } from '~/modules/auth/queries/current-user.query';

import { HomeView } from './home.view';

@controller({ view: HomeView, guards: [AuthGuard] })
export class HomeController implements OnDidMount {
  @observable authToken?: string;
  @observable currentUser?: { firstName: string; lastName: string };

  constructor(
    private readonly authQuery: AuthQuery,
    private readonly currentUserQuery: CurrentUserQuery,
    private readonly router: RouterService,
  ) {}

  onDidMount() {
    const authTokenSub = this.authQuery.authToken$.subscribe((v) => (this.authToken = v));
    const currentUserSub = this.currentUserQuery.currentUser$.subscribe(
      (v) => (this.currentUser = v),
    );

    return () => {
      authTokenSub.unsubscribe();
      currentUserSub.unsubscribe();
    };
  }

  logout() {
    this.authQuery.logout();
    this.router.push('/auth/login');
  }
}
