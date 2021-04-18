import { Controller, onDidMount, onDidRender } from '@tokamakjs/react';

import { ServiceA } from '../../services';

@Controller()
export class ChildController {
  constructor(private readonly _serviceA: ServiceA) {}

  public doStuff() {
    console.log(this._serviceA);
    console.log('FROM A', this._serviceA.hello());
    // this.router.push('/15');
  }

  @onDidMount()
  public async doStuffOnMount() {
    // console.log('Hello mount');

    return () => {
      // console.log('Hello unmount');
    };
  }

  @onDidRender()
  public doStuffAfterRender() {
    // const params = this.router.getParams(this);
    // console.log('Child params:', params.projectId);
  }
}
