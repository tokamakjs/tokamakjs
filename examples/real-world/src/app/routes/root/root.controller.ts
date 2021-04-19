import { RouterService } from '@tokamakjs/common';
import {
  Controller,
  effect,
  hook,
  onDidMount,
  onDidRender,
  ref,
  state,
  useResolve,
} from '@tokamakjs/react';

import { ServiceA, ServiceB } from '../../services';

@Controller()
export class RootController {
  @state public counter = 0;
  @state public name = 'Root';

  @ref public counterRef = 0;

  private readonly _serviceB = hook(() => useResolve(ServiceB));

  constructor(private readonly _serviceA: ServiceA, private readonly _router: RouterService) {
    console.log('how many times');
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
    console.log('Root params:', this._router.getParams(this));
  }

  @effect((inst: RootController) => [inst.name])
  public onNameChange() {
    console.log('name change');
    this.counter = this.counter + 1;
  }

  public doStuff() {
    console.log('FROM A', this._serviceA.hello());
    console.log('FROM B', this._serviceB?.bye());
    this._router.push('/child/12');
  }
}
