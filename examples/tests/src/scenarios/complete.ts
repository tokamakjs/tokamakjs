// Test @Inject decorator
// Test custom providers
// Test dynamic module

import { v4 } from 'uuid';

import { Injectable, Module } from '../tokamak/decorators';
import { inject } from '../tokamak/decorators/inject.decorator';
import { DiContainer } from '../tokamak/di-container';

const ID = '__ID__';

class ServiceA {
  public readonly id = v4();

  constructor(@inject(ID) public readonly id2: string) {}
}

@Injectable()
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}
}

@Module({ providers: [ServiceB] })
class AppModule {}

async function test() {
  const container = await DiContainer.from(AppModule, {
    globalProviders: [],
  });

  const serviceA = container.get(ServiceA);
  const serviceB = container.get(ServiceB);

  console.log('GLOBAL MODULE TEST:');
  console.log(' - ServiceA id:', serviceA.id);
  console.log(' - ServiceB id:', serviceB.id);
  console.log('   - ServiceA id inside ServiceB:', serviceB.serviceA.id);

  console.assert(serviceA.id === serviceB.serviceA.id);
}

test();
