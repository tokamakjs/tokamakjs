import { Class, ModuleMetadata } from '@tokamakjs/injection';

export type View = (ctrl: any) => JSX.Element | string | null;

export interface ControllerMetadata {
  view: View;
}

export type RouteHandler = Class | View;

export interface RouteDefinition {
  path: string;
  controller: Class;
  children: Array<RouteDefinition>;
}

export interface SubAppMetadata extends ModuleMetadata {
  routing: Array<RouteDefinition>;
}

export interface TokamakAppConfig {
  historyMode: 'browser' | 'hash' | 'memory';
  basePath: string;
}
