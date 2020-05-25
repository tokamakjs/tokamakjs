import { controller } from 'vendor/tokamak';

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
export class RootController {
  @observable public isLoading = false;

  constructor(testQuery: TestQuery, private readonly testService: TestService) {
    testQuery.isLoading$.subscribe((isLoading) => (this.isLoading = isLoading));
    // testQuery.isLoading$.subscribe(console.log);
  }

  login() {
    this.testService.login();
  }

  render() {
    console.log('RENDER', this.isLoading);
  }
}
