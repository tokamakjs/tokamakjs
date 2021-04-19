export class NoDiContainerFoundException extends Error {
  constructor() {
    super(`Could not find a valid DiContainer in the context.`);
  }
}
