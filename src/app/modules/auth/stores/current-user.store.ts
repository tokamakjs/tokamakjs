import { Store, StoreConfig } from '@datorama/akita';
import { injectable } from 'vendor/tokamak';

export interface CurrentUserState {
  currentUser?: {
    firstName: string;
    lastName: string;
  };
}

function getInitialState(): CurrentUserState {
  return {};
}

@injectable()
@StoreConfig({ name: 'currentUser' })
export class CurrentUserStore extends Store<CurrentUserState> {
  constructor() {
    super(getInitialState());
  }
}
