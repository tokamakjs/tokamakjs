import { ControllerWrapper, OnDidMount, controller } from 'vendor/tokamak';

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
      (this as any).wrapper?.refresh();
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
  public wrapper: any = 'asdfa';

  constructor(private readonly testQuery: TestQuery, private readonly testService: TestService) {}

  onDidMount() {
    this.testQuery.isLoading$.subscribe((isLoading) => (this.isLoading = isLoading ?? false));
  }

  login() {
    this.testService.login();
  }

  getWrapper() {
    return this;
  }
}
