import { ModuleMetadata } from '@tokamakjs/injection';
import { ElementType } from 'react';

export interface ControllerMetadata {}

export type RouteHandler = ElementType;

export interface RouteDefinition {
  Component: ElementType;
  path: string;
  children: Array<RouteDefinition>;
}

export interface SubAppMetadata extends ModuleMetadata {
  routing?: Array<RouteDefinition>;
}

export interface TokamakAppConfig {
  historyMode: 'browser' | 'hash' | 'memory';
  basePath: string;
}

/**
 * Used to calculate the list of dependencies for
 * the @effect() decorator.
 */
export type DepsFn = (instance: any) => Array<any> | undefined;

/**
 * The final type of a class after being decorated with
 * the @Controller() decorator.
 */
export type DecoratedController<T = any> = T & {
  __controller__: {
    stateKeys: Array<PropertyKey>;
    refKeys: Array<PropertyKey>;
    effectKeysMap: Map<PropertyKey, DepsFn>;
  };
};

export function isDecoratedController<T>(controller: T): controller is DecoratedController<T> {
  return (controller as any)?.__controller__ != null;
}
