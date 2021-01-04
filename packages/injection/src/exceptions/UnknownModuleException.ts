export class UnknownModuleException extends Error {
  constructor(context = '') {
    super(`Could not select the given module (it does not exist in current context: "${context}")`);
  }
}
