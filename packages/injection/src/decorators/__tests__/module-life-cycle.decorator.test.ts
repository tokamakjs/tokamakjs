import { jest } from '@jest/globals';

describe('@tokamakjs/injection', () => {
  describe('decorators/module-life-cycle', () => {
    it('adds the decorated method to the correct life cycle hook.', async () => {
      jest.unstable_mockModule('../../utils/hooks', () => {
        return { addHook: jest.fn() };
      });

      const { addHook } = await import('../../utils/hooks');
      const { onModuleDidInit, onModuleInit } = await import('../module-life-cycle.decorator');

      class TestClass {
        @onModuleInit()
        public onModuleInit() {}

        @onModuleDidInit()
        public onModuleDidInit() {}
      }

      const t = new TestClass();

      expect(addHook).toHaveBeenNthCalledWith(1, t, 'onModuleInit', t.onModuleInit);
      expect(addHook).toHaveBeenNthCalledWith(2, t, 'onModuleDidInit', t.onModuleDidInit);
    });
  });
});
