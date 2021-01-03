// Test custom providers
// Test dynamic module

import { Scope, createInjectionContext } from 'src/tokamak/injection-context';
import { v4 } from 'uuid';

import { Injectable, Module } from '../tokamak/decorators';
import { inject } from '../tokamak/decorators/inject.decorator';
import { DiContainer } from '../tokamak/di-container';

const ID = '__ID__';

class ExternalService {
  public readonly id = v4();
}

class TransientExternalService {
  public readonly id = v4();
}

@Injectable()
class ServiceA {
  public readonly id = v4();

  constructor(
    @inject(ID) public readonly id2: string,
    public readonly externalService: ExternalService,
    public readonly tExternalService: TransientExternalService,
  ) {}
}

@Injectable()
class ServiceB {
  public readonly id = v4();

  constructor(
    public readonly serviceA: ServiceA,
    public readonly externalService: ExternalService,
    public readonly tExternalService: TransientExternalService,
  ) {}
}

@Module({
  providers: [
    ServiceB,
    ServiceA,
    { provide: ExternalService, useClass: ExternalService },
    {
      provide: TransientExternalService,
      useClass: TransientExternalService,
      scope: Scope.TRANSIENT,
    },
  ],
})
class AppModule {}

async function test() {
  const container = await DiContainer.from(AppModule, {
    globalProviders: [{ provide: ID, useValue: '__ID_VALUE__' }],
  });

  const contextA = createInjectionContext();
  const serviceA = await container.resolve(ServiceA, contextA);
  const contextB = createInjectionContext();
  const serviceB = await container.resolve(ServiceB, contextB);

  console.log(container);
  console.log('GLOBAL MODULE TEST:');
  console.log(' - ServiceA id:', serviceA.id);
  console.log(' - ServiceA id2:', serviceA.id2);
  console.log('   - ExternalService id inside ServiceA:', serviceA.externalService.id);
  console.log('   - TransientExternalService id inside ServiceA:', serviceA.tExternalService.id);
  console.log(' - ServiceB id:', serviceB.id);
  console.log('   - ServiceA id inside ServiceB:', serviceB.serviceA.id);
  console.log('   - ExternalService id inside ServiceB:', serviceB.externalService.id);
  console.log('   - TransientExternalService id inside ServiceA:', serviceB.tExternalService.id);

  console.assert(serviceA.id2 === '__ID_VALUE__');
  console.assert(serviceA.externalService.id === serviceB.externalService.id);
  console.assert(serviceA.tExternalService.id !== serviceB.tExternalService.id);
}

test();
