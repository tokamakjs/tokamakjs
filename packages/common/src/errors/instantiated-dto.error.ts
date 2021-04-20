export class InstantiatedDtoError extends Error {
  constructor() {
    super(`Cannot manually create an instance of a dto class. Please, use ze.validate() instead.`);
  }
}
