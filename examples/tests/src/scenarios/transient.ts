import { DiContainer, Injectable, Module, Scope } from '@tokamakjs/injection';
import { v4 } from 'uuid';

@Injectable()
class ServiceA {
  public readonly id = v4();
}

@Injectable({ scope: Scope.TRANSIENT })
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}
}

@Injectable()
class ServiceC {
  public readonly id = v4();

  constructor(public readonly serviceB: ServiceB) {}
}

@Injectable()
class ServiceD {
  public readonly id = v4();

  constructor(public readonly serviceB: ServiceB) {}
}

@Module({ providers: [ServiceA, ServiceB, ServiceC, ServiceD] })
class AppModule {}

async function test() {
  const container = await DiContainer.from(AppModule);

  const serviceA = container.get(ServiceA);
  const serviceA2 = container.get(ServiceA);
  const serviceB = await container.resolve(ServiceB);
  const serviceB2 = await container.resolve(ServiceB);
  const serviceC = container.get(ServiceC);
  const serviceD = container.get(ServiceD);

  console.log('TRANSIENT TEST:');

  console.assert(serviceA.id === serviceB.serviceA.id, 'ServiceA ids do not match.');
  console.assert(serviceA.id === serviceA2.id, 'ServiceA ids do not match.');
  console.assert(
    serviceC.serviceB.id !== serviceD.serviceB.id && serviceC.serviceB.id !== serviceB.id,
    'ServiceB ids are the same.',
  );
  console.assert(serviceB.id !== serviceB2.id, 'ServiceB ids are the same');
}

test();
