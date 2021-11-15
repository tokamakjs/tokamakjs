import 'reflect-metadata';

import { Class, Injectable, Module, Scope } from '@tokamakjs/injection';

import { NoControllerMetadataError, NoSubAppMetadataError } from '../errors';
import {
  ControllerMetadata,
  DecoratedController,
  DepsFn,
  HooksContainer,
  RouteDefinition,
  SubAppMetadata,
} from '../types';

export class Reflector {
  public static addControllerMetadata(target: Function, metadata: ControllerMetadata): void {
    Injectable({ scope: Scope.TRANSIENT })(target);
    Reflect.defineMetadata('self:controller', metadata, target);
  }

  public static getControllerMetadata(target: Function): ControllerMetadata {
    const metadata = Reflect.getMetadata('self:controller', target);

    if (metadata == null) {
      throw new NoControllerMetadataError(target.name);
    }

    return metadata;
  }

  public static addSubAppMetadata(
    target: Function,
    metadata: Omit<SubAppMetadata, 'routing'> & {
      routing: Array<RouteDefinition> | Array<Array<RouteDefinition> | RouteDefinition>;
    },
  ): void {
    const { routing, ...moduleMetadata } = metadata;

    Module(moduleMetadata)(target);
    Reflect.defineMetadata('self:subapp', { ...moduleMetadata, routing: routing.flat() }, target);
  }

  public static getSubAppMetadata(target: Function): SubAppMetadata {
    const metadata = Reflect.getMetadata('self:subapp', target);

    if (metadata == null) {
      throw new NoSubAppMetadataError(target.name);
    }

    return metadata;
  }

  public static getEffectKeysMap(target: Object): Map<PropertyKey, DepsFn> | undefined {
    return Reflect.getMetadata('self:hookscontainer:effectkeysmap', target);
  }

  public static setInEffectKeysMap(target: Object, key: PropertyKey, deps?: DepsFn): void {
    let effectKeysMap = Reflector.getEffectKeysMap(target);

    if (effectKeysMap == null) {
      effectKeysMap = new Map<string | symbol, DepsFn>();
      Reflect.defineMetadata('self:hookscontainer:effectkeysmap', effectKeysMap, target);
    }

    effectKeysMap.set(key, deps ?? (() => undefined));
  }

  public static getMemoKeysMap(target: Object): Map<PropertyKey, DepsFn> | undefined {
    return Reflect.getMetadata('self:hookscontainer:memokeysmap', target);
  }

  public static setInMemoKeysMap(target: Object, key: PropertyKey, deps?: DepsFn): void {
    let memoKeysMap = Reflector.getMemoKeysMap(target);

    if (memoKeysMap == null) {
      memoKeysMap = new Map<string | symbol, DepsFn>();
      Reflect.defineMetadata('self:hookscontainer:memokeysmap', memoKeysMap, target);
    }

    memoKeysMap.set(key, deps ?? (() => undefined));
  }

  public static getStateKeys(target: Object): Array<PropertyKey> | undefined {
    return Reflect.getMetadata('self:hookscontainer:statekeys', target);
  }

  public static addToStateKeys(target: Object, key: PropertyKey): void {
    let stateKeys = Reflector.getStateKeys(target);

    if (stateKeys == null) {
      stateKeys = [];
      Reflect.defineMetadata('self:hookscontainer:statekeys', stateKeys, target);
    }

    stateKeys.push(key);
  }

  public static getRefKeys(target: Object): Array<PropertyKey> | undefined {
    return Reflect.getMetadata('self:hookscontainer:refkeys', target);
  }

  public static addToRefKeys(target: Object, key: PropertyKey): void {
    let refKeys = Reflector.getRefKeys(target);

    if (refKeys == null) {
      refKeys = [];
      Reflect.defineMetadata('self:hookscontainer:refkeys', refKeys, target);
    }

    refKeys.push(key);
  }

  public static copyMetadata(Source: Function, Target: Function): void {
    const keys = Reflect.getMetadataKeys(Source);
    keys.forEach((key) => Reflect.defineMetadata(key, Reflect.getMetadata(key, Source), Target));
  }

  public static addHookServiceMetadata(Target: Function): void {
    Reflect.defineMetadata('self:hookservice', {}, Target);
  }

  public static getHookServiceMetadata(Target: Function): {} | undefined {
    return Reflect.getMetadata('self:hookservice', Target);
  }

  public static createHooksContainer<T>(Target: Class<T>, ...args: Array<any>): HooksContainer<T> {
    const inst = new Target(...args) as HooksContainer<T>;

    const stateKeys = Reflector.getStateKeys(inst) ?? [];
    const refKeys = Reflector.getRefKeys(inst) ?? [];
    const effectKeysMap = Reflector.getEffectKeysMap(inst) ?? new Map<PropertyKey, DepsFn>();
    const memoKeysMap = Reflector.getMemoKeysMap(inst) ?? new Map<PropertyKey, DepsFn>();

    inst.__reactHooks__ = { stateKeys, refKeys, effectKeysMap, memoKeysMap };

    return inst;
  }

  public static createDecoratedController<T>(
    Target: Class<T>,
    ...args: Array<any>
  ): DecoratedController<T> {
    const inst = Reflector.createHooksContainer(Target, ...args) as DecoratedController<T>;
    const metadata = Reflector.getControllerMetadata(Target);

    inst.__controller__ = metadata;

    return inst;
  }
}
