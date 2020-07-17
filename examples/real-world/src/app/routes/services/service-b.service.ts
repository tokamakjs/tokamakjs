import { injectable } from '@tokamakjs/core';

import { ServiceA } from './service-a.service';

@injectable()
export class ServiceB {
  name = 'Service B';

  constructor(private readonly serviceA: ServiceA) {}

  bye() {
    return `Bye ${this.serviceA.name}`;
  }
}
