import { Query } from '@datorama/akita';
import { OnModuleDidInit, injectable } from 'vendor/tokamak';

import { CurrentUserState, CurrentUserStore } from '../stores/current-user.store';
import { AuthQuery } from './auth.query';

@injectable()
export class CurrentUserQuery extends Query<CurrentUserState> implements OnModuleDidInit {
  public readonly currentUser$ = this.select('currentUser');

  constructor(protected readonly store: CurrentUserStore, private readonly authQuery: AuthQuery) {
    super(store);
  }

  onModuleDidInit() {
    this.authQuery.authToken$.subscribe((authToken) => {
      const currentUser = this.decodeAuthToken(authToken);
      this.store.update({ currentUser });
    });
  }

  private decodeAuthToken(authToken?: string): CurrentUserState['currentUser'] {
    if (authToken == null) {
      return;
    }

    return JSON.parse(atob(authToken));
  }
}
