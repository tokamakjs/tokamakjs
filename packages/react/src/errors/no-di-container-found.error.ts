export class NoDiContainerFoundError extends Error {
  constructor() {
    super(`Could not find a valid DiContainer in the context.`);
  }
}
