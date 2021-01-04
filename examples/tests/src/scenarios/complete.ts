// Test custom providers
// Test dynamic module

import { Scope, createInjectionContext } from 'src/tokamak/injection-context';
import { v4 } from 'uuid';

import { Injectable, Module } from '../tokamak/decorators';
import { inject } from '../tokamak/decorators/inject.decorator';
import { DiContainer } from '../tokamak/di-container';

const ID = '__ID__';

@Injectable()
class ExternalService {
  public readonly id = v4();
}

@Injectable()
class TransientExternalService {
  public readonly id = v4();

  constructor(public readonly externalService: ExternalService) {}
}

@Injectable()
class ServiceA {
  public readonly id = v4();

  constructor(
    @inject(ID) public readonly id2: string,
    public readonly tExternalService: TransientExternalService,
  ) {}
}

@Injectable()
class ServiceB {
  public readonly id = v4();

  constructor(
    public readonly serviceA: ServiceA,
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

  const serviceA = await container.resolve(ServiceA);
  const serviceB = await container.resolve(ServiceB);

  // How do I tell the resolver that ExternalService has to be resolved
  // as a singleton if the only thing I have is the context?
  //
  // If context is different than { id: 1 }, then, a new instance is gonna
  // be created for TransientExternalService, however,

  // console.log(container);
  // console.log('COMPLETE TEST:');
  // console.log(' - ServiceA id:', serviceA.id);
  // console.log(' - ServiceA id2:', serviceA.id2);
  // console.log('   - TransientExternalService id inside ServiceA:', serviceA.tExternalService.id);
  // console.log(
  //   '     - ExternalService id inside TransientExternalService:',
  //   serviceA.tExternalService.externalService.id,
  // );
  // console.log(' - ServiceB id:', serviceB.id);
  // console.log('   - ServiceA id inside ServiceB:', serviceB.serviceA.id);
  // console.log('   - TransientExternalService id inside ServiceA:', serviceB.tExternalService.id);
  // console.log(
  //   '     - ExternalService id inside TransientExternalService:',
  //   serviceB.tExternalService.externalService.id,
  // );

  // console.assert(serviceA.id2 === '__ID_VALUE__');
  // console.assert(
  //   serviceA.tExternalService.externalService.id === serviceB.tExternalService.externalService.id,
  // );
  // console.assert(serviceA.tExternalService.id !== serviceB.tExternalService.id);
}

test();
