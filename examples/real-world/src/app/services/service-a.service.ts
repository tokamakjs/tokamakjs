import { Injectable } from '@tokamakjs/core';

import { ServiceB } from './service-b.service';

@Injectable()
export class ServiceA {
  name = 'Service A';

  constructor(private readonly serviceB: ServiceB) {}

  hello() {
    return `Hello ${this.serviceB.name}`;
  }
}
