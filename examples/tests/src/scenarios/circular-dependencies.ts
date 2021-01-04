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
    this.serviceB = this.moduleRef.get(ServiceB); // module scoped
    // this.serviceB = this.moduleRef.container?.get(ServiceB); // global
  }
}

@Injectable()
class ServiceB {
  public readonly id = v4();

  constructor(public readonly serviceA: ServiceA) {}
}

@Module({ providers: [ServiceA], imports: [forwardRef(() => TestModuleB)], exports: [ServiceA] })
class TestModuleA {}

@Module({ providers: [ServiceB], imports: [TestModuleA], exports: [ServiceB] })
class TestModuleB {}

@Module({ imports: [TestModuleA, TestModuleB] })
class AppModule {}

async function test() {
  const container = await DiContainer.from(AppModule);

  const serviceA = container.get(ServiceA);
  const serviceB = container.get(ServiceB);

  console.log('CIRCULAR DEPENDENCIES TEST:');

  console.assert(serviceA.id === serviceB.serviceA.id);
  console.assert(serviceB.id === serviceA.serviceB?.id);
}

test();
