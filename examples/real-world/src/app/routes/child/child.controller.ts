import { RouterService } from '@tokamakjs/common';
import { controller, onDidMount, onDidRender } from '@tokamakjs/core';

import { ServiceA, ServiceB } from '../../services';
import { ChildView } from './child.view';

@controller({ view: ChildView })
export class ChildController {
  constructor(
    private readonly serviceA: ServiceA,
    private readonly serviceB: ServiceB,
    private readonly router: RouterService,
  ) {}

  public doStuff() {
    console.log('FROM A', this.serviceA.hello());
    console.log('FROM B', this.serviceB.bye());
    this.router.push('/15');
  }

  @onDidMount()
  public doStuffOnMount() {
    console.log('Hello mount');

    return () => {
      console.log('Hello unmount');
    };
  }

  @onDidRender()
  public doStuffAfterRender() {
    console.log(this.router.params.projectId);
    console.log('Hello on did render');
  }
}
