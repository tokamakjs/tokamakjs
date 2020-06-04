import { OnDidMount, controller, observable } from 'vendor/tokamak';

import { AuthQuery } from '~/modules/auth/queries';

import { HomeView } from './home.view';

@controller({ view: HomeView })
export class HomeController implements OnDidMount {
  @observable authToken?: string;

  constructor(private readonly authQuery: AuthQuery) {}

  onDidMount() {
    this.authQuery.authToken$.subscribe((v) => (this.authToken = v));
  }

  logout() {
    this.authQuery.logout();
  }
}
