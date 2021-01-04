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

  const serviceA = container.get(ServiceA);
  const serviceB = container.get(ServiceB);

  console.log(container);
  console.log('COMPLETE TEST:');

  console.assert(serviceA.id2 === '__ID_VALUE__');
  console.assert(
    serviceA.tExternalService.externalService.id === serviceB.tExternalService.externalService.id,
    'ExternalService ids do not match.',
  );
  console.assert(
    serviceA.tExternalService.id !== serviceB.tExternalService.id,
    'TransientExternalServices ids are the same.',
  );
}

test();
