/**
 * This scenario verifies that @onModuleDidInit() can be used
 * in the module class itself.
 */

import { DiContainer, Module, onModuleDidInit, onModuleInit } from '@tokamakjs/injection';

let initialized = false;
let didInitialize = false;

@Module({})
class AppModule {
  @onModuleInit()
  public async onModuleInit(): Promise<void> {
    console.log('AppModule::onModuleInit called.');
    initialized = true;
  }

  @onModuleDidInit()
  public async onModuleDidInit(): Promise<void> {
    console.log('AppModule::onModuleDidInit called.');
    didInitialize = true;
  }
}

async function test() {
  await DiContainer.from(AppModule);

  console.assert(initialized, 'AppModule did not call onModuleInit()');
  console.assert(didInitialize, 'AppModule did not call onModuleDidInit()');

  document.writeln('Check console logs.');
}

test();
