import { Subscription } from 'rxjs';
import { OnDidMount, RouterService, controller, observable } from 'vendor/tokamak';

import { AuthQuery } from '../../queries';
import { LoginView } from './Login.view';

@controller({ view: LoginView })
export class LoginController implements OnDidMount {
  @observable isLoading = false;
  isLoadingSubscription?: Subscription;

  constructor(private readonly authQuery: AuthQuery, private readonly router: RouterService) {}

  onDidMount() {
    const subscription = this.authQuery.isLoading$.subscribe((v) => (this.isLoading = v));
    return () => {
      subscription.unsubscribe();
    };
  }

  async login(username: string, password: string): Promise<void> {
    await this.authQuery.login(username, password);
    this.router.push('/');
  }
}
