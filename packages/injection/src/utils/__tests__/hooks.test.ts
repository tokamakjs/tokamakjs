import { jest } from '@jest/globals';

import { addHook, hasHooks, runHooks, runHooksSync } from '../hooks';

describe('tokamakjs/injection', () => {
  describe('utils/hooks', () => {
    describe('addHook', () => {
      it('initializes a new __hooks__ property if none is found', () => {
        const target = {} as any;
        const hookCb = () => {};

        addHook(target, 'hook', hookCb);

        expect(target.__hooks__).toBeDefined();
        expect(target.__hooks__).toBeInstanceOf(Map);
        expect(target.__hooks__.get('hook')).toEqual([hookCb]);
      });

      it('apends the callback if there are already hooks in the provided key', () => {
        const target = { __hooks__: new Map() };

        const hookCb1 = () => {};
        const hookCb2 = () => {};

        target.__hooks__.set('hook', [hookCb1]);

        addHook(target, 'hook', hookCb2);

        expect(target.__hooks__.get('hook')).toEqual([hookCb1, hookCb2]);
      });

      it('correctly initializes a new key if no hooks are present in that key', () => {
        const target = { __hooks__: new Map() };

        const hookCb1 = () => {};
        const hookCb2 = () => {};

        target.__hooks__.set('hook', [hookCb1]);

        addHook(target, 'anotherHook', hookCb2);

        expect(target.__hooks__.get('hook')).toEqual([hookCb1]);
        expect(target.__hooks__.get('anotherHook')).toEqual([hookCb2]);
      });
    });

    describe('runHooks', () => {
      it('returns an empty array if no hooks are found', async () => {
        const target = {};
        const result = await runHooks(target, 'hook');
        expect(result).toEqual([]);
      });

      it('runs the hooks found under the specified key', async () => {
        const hookSpy = jest.fn();
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [hookSpy]);

        await runHooks(target, 'hook');

        expect(hookSpy).toHaveBeenCalledTimes(1);
      });

      it('runs only the hooks under the specified key', async () => {
        const hookSpy = jest.fn();
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [hookSpy]);

        await runHooks(target, 'anotherHook');

        expect(hookSpy).toHaveBeenCalledTimes(0);
      });

      it('returns an array with the results of the hooks', async () => {
        const hookSpy = jest.fn().mockReturnValue('hook-result');
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [hookSpy]);

        const result = await runHooks(target, 'hook');

        expect(hookSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(['hook-result']);
      });
    });

    describe('runHooksSync', () => {
      it('returns an empty array if no hooks are found', () => {
        const target = {};
        const result = runHooksSync(target, 'hook');
        expect(result).toEqual([]);
      });

      it('runs the hooks found under the specified key', () => {
        const hookSpy = jest.fn();
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [hookSpy]);

        runHooksSync(target, 'hook');

        expect(hookSpy).toHaveBeenCalledTimes(1);
      });

      it('runs only the hooks under the specified key', () => {
        const hookSpy = jest.fn();
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [hookSpy]);

        runHooksSync(target, 'anotherHook');

        expect(hookSpy).toHaveBeenCalledTimes(0);
      });

      it('returns an array with the results of the hooks', () => {
        const hookSpy = jest.fn().mockReturnValue('hook-result');
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [hookSpy]);

        const result = runHooksSync(target, 'hook');

        expect(hookSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual(['hook-result']);
      });
    });

    describe('hasHooks', () => {
      it('returns false if no hooks are found', () => {
        const target = {};
        const result = hasHooks(target);
        expect(result).toBe(false);
      });

      it('returns false if no hooks are found under the specified key', () => {
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [() => {}]);
        const result = hasHooks(target, 'anotherHook');
        expect(result).toBe(false);
      });

      it('returns true if hooks are found and no key is specified', () => {
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [() => {}]);
        const result = hasHooks(target);
        expect(result).toBe(true);
      });

      it('returns true if hooks are found under the specified key', () => {
        const target = { __hooks__: new Map() };
        target.__hooks__.set('hook', [() => {}]);
        const result = hasHooks(target, 'hook');
        expect(result).toBe(true);
      });
    });
  });
});
