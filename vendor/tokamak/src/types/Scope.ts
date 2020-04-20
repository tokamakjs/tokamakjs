// TODO: Support different scopes
// For now, only SINGLETON is available
//
// the way of defining scopes is:
// @injectable({ scope: Scope.TRANSIENT })
export enum Scope {
  SINGLETON = 'SINGLETON',
  TRANSIENT = 'TRANSIENT',
}
