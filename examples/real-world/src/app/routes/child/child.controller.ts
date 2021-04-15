import { RouterService } from '@tokamakjs/common';
import { Controller, onDidMount, onDidRender } from '@tokamakjs/react';

import { ServiceA, ServiceB } from '../../services';

@Controller()
export class ChildController {
  constructor(
    private readonly _serviceA: ServiceA,
    private readonly _serviceB: ServiceB,
    private readonly _router: RouterService,
  ) {}

  public doStuff() {
    console.log('FROM A', this._serviceA.hello());
    console.log('FROM B', this._serviceB.bye());
    // this.router.push('/15');
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
    // const params = this.router.getParams(this);
    // console.log('Child params:', params.projectId);
  }
}
