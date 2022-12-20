import { jest } from '@jest/globals';

import { Reflector } from '../../reflection';
import { ModuleMetadata } from '../../types';
import { Module } from '../module.decorator';

describe('@tokamakjs/injection', () => {
  describe('decorators/module', () => {
    it('adds module metadata to the class using Reflector.', () => {
      const addMetadataMock = jest.spyOn(Reflector, 'addModuleMetadata');
      const moduleMetadata: ModuleMetadata = { providers: [], imports: [], exports: [] };

      @Module(moduleMetadata)
      class TestModule {}

      expect(addMetadataMock).toHaveBeenCalledWith(TestModule, moduleMetadata);
      expect(Reflector.getModuleMetadata(TestModule)).toEqual(moduleMetadata);
    });
  });
});
