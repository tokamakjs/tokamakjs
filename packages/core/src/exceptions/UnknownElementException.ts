export class UnknownElementException extends Error {
  constructor(name?: string) {
    super(
      `Could not find ${
        name ?? 'given'
      } element (this provider does not exist in the current context)`,
    );
  }
}
