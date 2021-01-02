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

export async function runHooks(target: any, hookName: string): Promise<void> {
  if (!containsHooks(target)) return;

  const hooks = target.__hooks__.get(hookName);
  if (hooks == null) return;

  for (const hook of hooks) {
    await hook();
  }
}
