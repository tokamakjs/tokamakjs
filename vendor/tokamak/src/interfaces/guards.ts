export interface RouterState {
  url: string;
}

export interface CanActivate {
  canActivate(state: RouterState): boolean | Promise<boolean>;
}
