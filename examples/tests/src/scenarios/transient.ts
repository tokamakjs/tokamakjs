import { Injectable, Module } from 'src/tokamak/decorators';
import { DiContainer } from 'src/tokamak/di-container';
import { Scope } from 'src/tokamak/injection-context';
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
  const serviceB = await container.resolve(ServiceB);
  const serviceC = await container.resolve(ServiceC);
  const serviceD = await container.resolve(ServiceD);

  console.log(serviceA);
  console.log(serviceC);
  console.log(serviceD);

  console.assert(serviceA.id == serviceB.serviceA.id, 'ServiceA ids do not match.');
  console.assert(serviceC.serviceB.id !== serviceD.serviceB.id, 'ServiceB ids are the same.');
}

test();
