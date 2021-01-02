import { onModuleInit } from 'src/tokamak/decorators/module-life-cycle.decorator';
import { v4 } from 'uuid';

import { Injectable, Module } from '../tokamak/decorators';
import { DiContainer } from '../tokamak/di-container';
import { Scope, createInjectionContext } from '../tokamak/injection-context';

@Injectable()
class ServiceA {
  public readonly id = v4();

  @onModuleInit()
  public doSomething(): void {
    console.log('Doing something!');
  }
}

@Injectable({ scope: Scope.TRANSIENT })
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}
}

@Injectable()
class ServiceC {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA, public readonly serviceB: ServiceB) {}
}

@Module({ providers: [ServiceA, ServiceB, ServiceC] })
class TestModule {}

@Module({ imports: [TestModule] })
class AppModule {}

async function testSingletonInstances() {
  const ctx = createInjectionContext();
  const container = await DiContainer.from(AppModule);

  const serviceA = container.get(ServiceA);
  const serviceB = await container.resolve(ServiceB, ctx);
  const serviceC = container.get(ServiceC);

  console.log('BASIC TEST:');
  console.log(' - ServiceA id:', serviceA.id);
  console.log(' - ServiceB id:', serviceB.id);
  console.log('   - ServiceA id inside ServiceB:', serviceB.serviceA.id);
  console.log(' - ServiceC id:', serviceC.id);
  console.log('   - ServiceA id inside ServiceC:', serviceC.serviceA.id);
  console.log('   - ServiceB id inside ServiceC:', serviceC.serviceB.id);

  console.assert(serviceA.id === serviceB.serviceA.id && serviceA.id === serviceC.serviceA.id);
  console.assert(serviceB.id !== serviceC.serviceB.id);
}

testSingletonInstances();
