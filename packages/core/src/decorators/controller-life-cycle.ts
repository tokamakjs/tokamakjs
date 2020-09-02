type HookName = 'onDidMount' | 'onWillUnmount' | 'onDidRender';

export interface WithHooks {
  __hooks__: Map<HookName, Array<Function>>;
}

function _addHook(target: any, hookName: HookName, hookFn: Function): void {
  if (target.__hooks__ == null) {
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

export function onDidMount(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    _addHook(target, 'onDidMount', (target as any)[propertyKey]);
  };
}

export function onWillUnmount(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    _addHook(target, 'onWillUnmount', (target as any)[propertyKey]);
  };
}

export function onDidRender(): MethodDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    _addHook(target, 'onDidRender', (target as any)[propertyKey]);
  };
}

export function hasHooks(controller: any): controller is WithHooks {
  return controller?.__hooks__ != null;
}
