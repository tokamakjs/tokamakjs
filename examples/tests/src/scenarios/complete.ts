import {
  DiContainer,
  DynamicModule,
  Injectable,
  Module,
  Scope,
  inject,
} from '@tokamakjs/injection';

const ID = '__ID__';

const createId = (prefix: string): string => {
  return `${prefix}_${Math.floor(Math.random() * 10)}`;
};

@Injectable()
class ExternalService {
  public readonly id = createId('ExternalService');
}

@Injectable()
class TransientExternalService {
  public readonly id = createId('TransientExternalService');

  constructor(public readonly externalService: ExternalService) {}
}

@Injectable()
class ServiceA {
  public readonly id = createId('ServiceA');

  constructor(
    @inject(ID) public readonly id2: string,
    public readonly tExternalService: TransientExternalService,
  ) {}
}

@Injectable()
class ServiceC {
  public readonly id = createId('ServiceC');
}

@Injectable()
class ServiceB {
  public readonly id = createId('ServiceB');

  constructor(
    public readonly tExternalService: TransientExternalService,
    public readonly serviceC: ServiceC,
  ) {}
}

class TestDynamicModule {
  static createModule(): DynamicModule<TestDynamicModule> {
    return {
      module: TestDynamicModule,
      providers: [ServiceC],
      exports: [ServiceC],
    };
  }
}

@Module({
  imports: [TestDynamicModule.createModule()],
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
  const serviceC = container.get(ServiceC);

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
  console.assert(serviceB.serviceC.id == serviceC.id, 'ServiceC ids do not match.');
}

test();
