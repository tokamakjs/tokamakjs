import { Injectable, ModuleRef, OnModuleInit } from '@tokamakjs/core';

import { ServiceA } from './service-a.service';

@Injectable()
export class ServiceB implements OnModuleInit {
  name = 'Service B';
  private serviceA?: ServiceA;

  constructor(private readonly moduleRef: ModuleRef) {}

  onModuleInit() {
    this.serviceA = this.moduleRef.get(ServiceA);
  }

  bye() {
    return `Bye ${this.serviceA?.name}`;
  }
}
