import { RouterService } from '@tokamakjs/common';
import {
  Controller,
  effect,
  onDidMount,
  onDidRender,
  ref,
  state,
  useParams,
} from '@tokamakjs/react';

import { ServiceA, ServiceB } from '../../services';

@Controller()
export class RootController {
  @state public counter = 0;
  @state public name = 'Root';

  @ref public counterRef = 0;

  private readonly _params = useParams();

  constructor(
    private readonly _serviceA: ServiceA,
    private readonly _serviceB: ServiceB,
    private readonly _router: RouterService,
  ) {}

  @onDidMount()
  public doStuffOnMount() {
    console.log('Hello mount');

    return () => {
      console.log('Hello unmount');
    };
  }

  @onDidRender()
  public doStuffAfterRender() {
    console.log(this._params);
    // const params = this._router.getParams(this);
    // console.log('Root params:', params.projectId);
  }

  @effect((inst: RootController) => [inst.name])
  public onNameChange() {
    console.log('name change');
    this.counter = this.counter + 1;
  }

  public doStuff() {
    console.log('FROM A', this._serviceA.hello());
    console.log('FROM B', this._serviceB.bye());
    // this._router.push('/15/12');
  }
}
