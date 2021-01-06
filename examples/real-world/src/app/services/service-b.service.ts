import { Injectable, ModuleRef, onModuleInit } from '@tokamakjs/react';

import { ServiceA } from './service-a.service';

@Injectable()
export class ServiceB {
  name = 'Service B';
  private serviceA?: ServiceA;

  constructor(private readonly moduleRef: ModuleRef) {}

  @onModuleInit()
  onModuleInit() {
    this.serviceA = this.moduleRef.get(ServiceA);
  }

  bye() {
    return `Bye ${this.serviceA?.name}`;
  }
}
