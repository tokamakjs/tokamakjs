import { ModuleRef } from 'src/tokamak/module-ref';
import { v4 } from 'uuid';

import { Injectable, Module, onModuleInit } from '../tokamak/decorators';
import { DiContainer } from '../tokamak/di-container';
import { forwardRef } from '../tokamak/forward-ref';

@Injectable()
class ServiceA {
  public readonly id = v4();
  public serviceB?: ServiceB;

  constructor(private readonly moduleRef: ModuleRef) {}

  @onModuleInit()
  public onModuleInit(): void {
    console.log(this.moduleRef);
    this.serviceB = this.moduleRef.get(ServiceB);
  }
}

@Injectable()
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}
}

@Module({ providers: [ServiceA], imports: [], exports: [ServiceA] })
class TestModuleA {}

@Module({ providers: [ServiceB], imports: [TestModuleA] })
class TestModuleB {}

@Module({ imports: [TestModuleA, TestModuleB] })
class AppModule {}

async function test() {
  const container = await DiContainer.from(AppModule);

  const serviceA = container.get(ServiceA);
  const serviceB = container.get(ServiceB);

  console.log('CIRCULAR DEPENDENCIES TEST:');
  console.log(' - ServiceA id:', serviceA.id);
  console.log('   - ServiceB id inside ServiceA:', serviceA.serviceB?.id);
  console.log(' - ServiceB id:', serviceB.id);
  console.log('   - ServiceA id inside ServiceB:', serviceB.serviceA.id);

  console.assert(serviceA.id === serviceB.serviceA.id);
  console.assert(serviceB.id === serviceA.serviceB?.id);
}

test();
