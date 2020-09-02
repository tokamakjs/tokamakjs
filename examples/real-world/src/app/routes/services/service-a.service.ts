import { injectable } from '@tokamakjs/core';

import { ServiceB } from './service-b.service';

@injectable()
export class ServiceA {
  name = 'Service A';

  constructor(private readonly serviceB: ServiceB) {}

  hello() {
    return `Hello ${this.serviceB.name}`;
  }
}
