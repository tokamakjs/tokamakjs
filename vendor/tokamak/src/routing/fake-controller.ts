export function createFakeController(routeName: string): {} {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          `Controller for ${routeName} not found. Maybe you forgot to add it to the @route decorator?`,
        );
      },
      set() {
        throw new Error(
          `Controller for ${routeName} not found. Maybe you forgot to add it to the @route decorator?`,
        );
      },
    },
  );
}
