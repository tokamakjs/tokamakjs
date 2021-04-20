export class IllegalArgumentError extends Error {
  constructor(message: string = 'Illegal argument used to invoke a method') {
    super(`IllegalArgumentException: ${message}`);
  }
}
