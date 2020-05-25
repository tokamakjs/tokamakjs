import { OnDidMount, controller } from 'vendor/tokamak';

import { TestQuery, TestService } from '~/Test.store';

import { RootView, RootViewError } from './Root.view';

function observable(target: Object, propertyKey: string | symbol): void {
  const propertyContainer = {} as any;

  Object.defineProperty(target, propertyKey, {
    configurable: true,
    enumerable: true,
    get() {
      return propertyContainer[propertyKey];
    },
    set(value: any) {
      if (value === propertyContainer[propertyKey]) {
        return;
      }

      propertyContainer[propertyKey] = value;
      (target as any).render();
    },
  } as PropertyDescriptor);
}

@controller({
  view: RootView,
  states: {
    error: RootViewError,
  },
})
export class RootController implements OnDidMount {
  @observable public isLoading = false;

  constructor(private readonly testQuery: TestQuery, private readonly testService: TestService) {
    // testQuery.isLoading$.subscribe(console.log);
  }

  onDidMount() {
    this.testQuery.isLoading$.subscribe((isLoading) => (this.isLoading = isLoading ?? false));
  }

  login() {
    this.testService.login();
  }

  render() {
    console.log('RENDER', this.isLoading);
  }
}
