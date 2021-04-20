export class InvalidControllerDependencyError extends Error {
  constructor(name: string) {
    super(
      `Controller ${name} found with dependencies marked as TRANSIENT. Please, use useResolve() instead.`,
    );
  }
}
