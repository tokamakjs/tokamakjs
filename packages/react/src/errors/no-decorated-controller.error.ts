export class NoDecoratedControllerError extends Error {
  constructor(name: string) {
    super(
      `The class ${name} has not been decorated with @Controller() but it's being used as one. Please, use @Controller() to decorate the class.`,
    );
  }
}
