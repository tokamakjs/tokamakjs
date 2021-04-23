export class InvalidResolveSyncError extends Error {
  constructor(name: string) {
    super(`Cannot resolve async provider ${name} synchronously. Used .resolve() instead.`);
  }
}
