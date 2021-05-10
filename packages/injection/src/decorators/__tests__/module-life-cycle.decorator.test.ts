import * as utils from '../../utils/hooks';
import { onModuleDidInit, onModuleInit } from '../module-life-cycle.decorator';

jest.mock('../../utils/hooks');

describe('@tokamakjs/injection', () => {
  describe('decorators/module-life-cycle', () => {
    class TestClass {
      @onModuleInit()
      public onModuleInit() {}

      @onModuleDidInit()
      public onModuleDidInit() {}
    }

    it('adds the decorated method to the correct life cycle hook.', () => {
      const t = new TestClass();

      expect(utils.addHook).toHaveBeenNthCalledWith(1, t, 'onModuleInit', t.onModuleInit);
      expect(utils.addHook).toHaveBeenNthCalledWith(2, t, 'onModuleDidInit', t.onModuleDidInit);
    });
  });
});
