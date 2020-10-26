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
    const params = this.router.getParams(this);
    console.log('Child params:', params.projectId);
  }
}
