import { RouterService } from '@tokamakjs/common';
import { Controller, onDidMount, onDidRender } from '@tokamakjs/react';

import { ServiceA } from '../../services';

interface Params {
  projectId: string;
}

@Controller()
export class ChildController {
  constructor(
    private readonly _serviceA: ServiceA,
    private readonly _router: RouterService<Params>,
  ) {}

  @onDidMount()
  public async doStuffOnMount() {
    console.log('Hello mount child');

    return () => {
      console.log('Hello unmount child');
    };
  }

  @onDidRender()
  public doStuffAfterRender() {
    const params = this._router.getParams(this);
    console.log('Child params:', params.projectId);
  }

  public doStuff() {
    console.log(this._serviceA);
    console.log('FROM A', this._serviceA.hello());
  }

  public back() {
    this._router.push('/root');
  }
}
