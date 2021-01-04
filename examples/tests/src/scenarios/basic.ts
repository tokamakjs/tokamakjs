import { v4 } from 'uuid';

import { Injectable, Module, onModuleDidInit, onModuleInit } from '../tokamak/decorators';
import { DiContainer } from '../tokamak/di-container';
import { Scope } from '../tokamak/injection-context';

@Injectable()
class ServiceA {
  public readonly id = v4();

  @onModuleInit()
  public doSomething(): void {
    console.log('ServiceA :: OnModuleInit');
  }

  @onModuleDidInit()
  public doSomethingAfter(): void {
    console.log('ServiceA :: OnModuleDidInit');
  }
}

@Injectable({ scope: Scope.TRANSIENT })
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}

  @onModuleInit()
  public doSomething(): void {
    console.log('ServiceB :: OnModuleInit');
  }

  @onModuleDidInit()
  public doSomethingAfter(): void {
    console.log('ServiceB :: OnModuleDidInit');
  }
}

@Injectable()
class ServiceC {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA, public readonly serviceB: ServiceB) {}

  @onModuleInit()
  public doSomething(): void {
    console.log('ServiceC :: OnModuleInit');
  }

  @onModuleDidInit()
  public doSomethingAfter(): void {
    console.log('ServiceC :: OnModuleDidInit');
  }
}

@Module({ providers: [ServiceA, ServiceB, ServiceC] })
class TestModule {}

@Module({ imports: [TestModule] })
class AppModule {}

async function testSingletonInstances() {
  const container = await DiContainer.from(AppModule);

  const serviceA = container.get(ServiceA);
  const serviceB = container.get(ServiceB);
  const serviceC = container.get(ServiceC);

  console.log('BASIC TEST:');

  console.assert(serviceA.id === serviceB.serviceA.id && serviceA.id === serviceC.serviceA.id);
  console.assert(serviceB.id !== serviceC.serviceB.id);
}

testSingletonInstances();
