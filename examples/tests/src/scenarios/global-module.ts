import { v4 } from 'uuid';

import { Injectable, Module } from '../tokamak/decorators';
import { DiContainer } from '../tokamak/di-container';

class ServiceA {
  public readonly id = v4();
}

@Injectable()
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}
}

@Module({ providers: [ServiceB] })
class AppModule {}

async function test() {
  const serviceA = new ServiceA();

  const container = await DiContainer.from(AppModule, {
    globalProviders: [{ provide: ServiceA, useValue: serviceA }],
  });

  const serviceB = container.get(ServiceB);

  console.log('GLOBAL MODULE TEST:');
  console.log(' - ServiceA id:', serviceA.id);
  console.log(' - ServiceB id:', serviceB.id);
  console.log('   - ServiceA id inside ServiceB:', serviceB.serviceA.id);

  console.assert(serviceA.id === serviceB.serviceA.id);
}

test();
