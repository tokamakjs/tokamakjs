import { RouterService } from '@tokamakjs/common';
import { Controller, onDidMount, onDidRender } from '@tokamakjs/react';

import { ServiceA, ServiceB } from '../../services';
import { RootView } from './root.view';

@Controller({ view: RootView })
export class RootController {
  constructor(
    private readonly serviceA: ServiceA,
    private readonly serviceB: ServiceB,
    private readonly router: RouterService,
  ) {}

  public doStuff() {
    console.log('FROM A', this.serviceA.hello());
    console.log('FROM B', this.serviceB.bye());
    this.router.push('/15/12');
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
    console.log('Root params:', params.projectId);
  }
}
