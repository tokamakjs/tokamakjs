import { Scope } from '@tokamakjs/injection';
import { Injectable } from '@tokamakjs/react';

import { ServiceB } from './service-b.service';

@Injectable({ scope: Scope.SINGLETON })
export class ServiceA {
  name = 'Service A';

  constructor(private readonly serviceB: ServiceB) {
    // console.log(
    //   'If an injectable is marked as singleton, it cannot be instantiated more than once. This message should only appear once then.',
    // );
  }

  hello() {
    return `Hello ${this.serviceB.name}`;
  }
}
