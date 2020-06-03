import { OnDidMount, controller, observable } from 'vendor/tokamak';

import { TestQuery, TestService } from '~/Test.store';

import { RootView, RootViewError } from './Root.view';

@controller({
  view: RootView,
  states: {
    error: RootViewError,
  },
})
export class RootController implements OnDidMount {
  @observable public isLoading = false;

  constructor(private readonly testQuery: TestQuery, private readonly testService: TestService) {}

  onDidMount() {
    this.testQuery.isLoading$.subscribe((isLoading) => (this.isLoading = isLoading ?? false));
  }

  login() {
    this.testService.login();
  }
}
