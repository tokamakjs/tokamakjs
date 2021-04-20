export class UndefinedDependencyError extends Error {
  constructor(name?: string, context?: string) {
    super(`Cannot find ${name} dependency in ${context} context.`);
  }
}
