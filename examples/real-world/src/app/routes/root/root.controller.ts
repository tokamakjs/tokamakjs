import { controller, onDidMount, onDidRender } from '@tokamakjs/core';

import { RouterService } from '../../../../../../packages/common/lib';
import { ServiceA, ServiceB } from '../services';
import { RootView } from './root.view';

@controller({ view: RootView })
export class RootController {
  constructor(
    private readonly serviceA: ServiceA,
    private readonly serviceB: ServiceB,
    private readonly router: RouterService,
  ) {}

  doStuff() {
    console.log('FROM A', this.serviceA.hello());
    console.log('FROM B', this.serviceB.bye());
    this.router.push('/15');
  }

  @onDidMount()
  doStuffOnMount() {
    console.log('Hello mount');

    return () => {
      console.log('Hello unmount');
    };
  }

  @onDidRender()
  doStuffAfterRender() {
    console.log(this.router.match);
    console.log('Hello on did render');
  }
}
