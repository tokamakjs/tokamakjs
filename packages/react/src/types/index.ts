import { ErrorHandler, Guard } from '@tokamakjs/common';
import { Class, ModuleMetadata } from '@tokamakjs/injection';
import { ElementType } from 'react';

/**
 * Used to calculate the list of dependencies for
 * the @effect() decorator.
 */
export type DepsFn = (instance: any) => Array<any> | undefined;

/**
 * Any class that utilizes @effect(), @state() or @ref() decorators.
 */
export type HooksContainer<T = any> = T & {
  __reactHooks__: {
    stateKeys: Array<PropertyKey>;
    refKeys: Array<PropertyKey>;
    effectKeysMap: Map<PropertyKey, DepsFn>;
  };
};

export function isHooksContainer<T>(inst: T): inst is HooksContainer<T> {
  return (inst as any)?.__reactHooks__ != null;
}

export interface ControllerMetadata {
  view: ElementType;
  guards?: Array<Class<Guard>>;
  handlers?: Array<Class<ErrorHandler<any>> | ErrorHandler<any>>;
}

/**
 * The final type of a class after being decorated with
 * the @Controller() decorator.
 */
export type DecoratedController<T = any> = T &
  HooksContainer<T> & { __controller__: ControllerMetadata };

export function isDecoratedController<T>(controller: T): controller is DecoratedController<T> {
  return (controller as any)?.__controller__ != null && (controller as any)?.__reactHooks__ != null;
}

export type RouteHandler = ElementType;

export interface RouteDefinition {
  Controller: Class<DecoratedController>;
  path: string;
  children: Array<RouteDefinition>;
}

export interface SubAppMetadata extends ModuleMetadata {
  routing: Array<RouteDefinition>;
}

export interface TokamakAppConfig {
  historyMode: 'browser' | 'hash' | 'memory';
  basePath: string;
}
