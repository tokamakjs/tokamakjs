import { RouterService } from '@tokamakjs/common';
import { Controller, onDidMount, onDidRender } from '@tokamakjs/core';

import { ServiceA, ServiceB } from '../../services';
import { ChildView } from './child.view';

@Controller({ view: ChildView })
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
  public async doStuffOnMount() {
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
