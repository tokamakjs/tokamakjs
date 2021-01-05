export interface WithHooks {
  __hooks__: Map<string, Array<Function>>;
}

export function containsHooks(target: any): target is WithHooks {
  return target?.__hooks__ != null;
}

export function addHook(target: any, hookName: string, hookFn: Function): void {
  if (!containsHooks(target)) {
    Object.defineProperty(target, '__hooks__', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Map<string, Array<Function>>(),
    });
  }

  const existingHooks = target.__hooks__.get(hookName) ?? [];
  target.__hooks__.set(hookName, [...existingHooks, hookFn]);
}

export async function runHooks(target: any, hookName: string): Promise<Array<any>> {
  if (!containsHooks(target)) return [];

  const hooks = target.__hooks__.get(hookName);
  if (hooks == null) return [];

  const results = [];

  for (const hook of hooks) {
    results.push(await hook.call(target));
  }

  return results;
}

export function runHooksSync(target: any, hookName: string): Array<any> {
  if (!containsHooks(target)) return [];

  const hooks = target.__hooks__.get(hookName);
  if (hooks == null) return [];

  return hooks.map((hook) => hook.call(target));
}

export function hasHooks(target: any, hookName?: string): target is WithHooks {
  if (hookName == null) return containsHooks(target);
  if (!containsHooks(target)) return false;
  return target.__hooks__.has(hookName) && target.__hooks__.get(hookName)!.length > 0;
}
