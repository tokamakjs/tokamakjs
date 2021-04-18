import { Scope } from '@tokamakjs/injection';
import { Injectable, ModuleRef, onModuleInit } from '@tokamakjs/react';

import { ServiceA } from './service-a.service';

@Injectable({ scope: Scope.TRANSIENT })
export class ServiceB {
  name = 'Service B';
  private serviceA?: ServiceA;

  constructor(private readonly moduleRef: ModuleRef) {
    // console.log(
    //   'A transient instance will always be instantiated before being injected. This message can appear more than once.',
    // );
  }

  @onModuleInit()
  public onModuleInit() {
    this.serviceA = this.moduleRef.get(ServiceA);
    // console.log('THIS SHOULD BE CALLED', this.serviceA);
  }

  public bye() {
    return `Bye ${this.serviceA?.name}`;
  }
}
