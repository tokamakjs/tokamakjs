import {
  Controller,
  effect,
  hook,
  onDidMount,
  onDidRender,
  ref,
  state,
  useParams,
  useResolve,
} from '@tokamakjs/react';

import { ServiceA, ServiceB } from '../../services';

@Controller()
export class RootController {
  @state public counter = 0;
  @state public name = 'Root';

  @ref public counterRef = 0;

  private readonly _params = hook(() => useParams());
  private readonly _serviceB = hook(() => useResolve(ServiceB));

  constructor(private readonly _serviceA: ServiceA) {
    console.log('how many times');
  }

  @onDidMount()
  public doStuffOnMount() {
    // console.log('Hello mount');

    return () => {
      // console.log('Hello unmount');
    };
  }

  @onDidRender()
  public doStuffAfterRender() {
    console.log(this._params);
    // console.log('Root params:', this._params.projectId);
  }

  @effect((inst: RootController) => [inst.name])
  public onNameChange() {
    // console.log('name change');
    this.counter = this.counter + 1;
  }

  public doStuff() {
    console.log('FROM A', this._serviceA.hello());
    console.log('FROM B', this._serviceB?.bye());
  }
}
