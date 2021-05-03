export interface Guard {
  canActivate(): boolean | Promise<boolean>;
  didActivate?: VoidFunction;
  didNotActivate?: VoidFunction;
}
