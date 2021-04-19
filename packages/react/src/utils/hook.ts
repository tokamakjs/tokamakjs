/**
 * Used to register a hook in a controller so it's correctly
 * picked up:
 *
 * public readonly property = hook(() => useMyHook())
 *
 * Why this syntax instead os somehing like @hook(() => useMyHook())?
 * So the compiler picks the right type in the property since
 * decorators cannot yet enfore a specific property type.
 */
export function hook<T>(hookCb: () => T): T {
  // Changing the type here to any is intentional so
  // when used in a class, it returns the real type after
  // the hooks is processed in the @Controller() decorator.
  // However, this leads to unexpected behavior when used in a
  // class that is not decorated with @Controller().
  return { __hookCb__: hookCb } as any;
}
