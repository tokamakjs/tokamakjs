import 'reflect-metadata';

import { Injectable, Module, Scope } from '@tokamakjs/injection';

import { NoControllerMetadataException, NoSubAppMetadataException } from '../exceptions';
import { ControllerMetadata, DepsFn, SubAppMetadata } from '../types';

export class Reflector {
  static addControllerMetadata(target: Function, metadata: ControllerMetadata): void {
    Injectable({ scope: Scope.TRANSIENT })(target);
    Reflect.defineMetadata('self:controller', metadata, target);
  }

  static getControllerMetadata(target: Function): ControllerMetadata {
    const metadata = Reflect.getMetadata('self:controller', target);

    if (metadata == null) {
      throw new NoControllerMetadataException(target.name);
    }

    return metadata;
  }

  static addSubAppMetadata(target: Function, metadata: SubAppMetadata): void {
    const { routing, ...moduleMetadata } = metadata;

    Module(moduleMetadata)(target);
    Reflect.defineMetadata('self:subapp', metadata, target);
  }

  static getSubAppMetadata(target: Function): SubAppMetadata {
    const metadata = Reflect.getMetadata('self:subapp', target);

    if (metadata == null) {
      throw new NoSubAppMetadataException(target.name);
    }

    return metadata;
  }

  static getEffectKeysMap(target: Object): Map<PropertyKey, DepsFn> | undefined {
    return Reflect.getMetadata('self:controller:effectkeysmap', target);
  }

  static setInEffectKeysMap(target: Object, key: PropertyKey, deps?: DepsFn): void {
    let effectKeysMap = Reflector.getEffectKeysMap(target);

    if (effectKeysMap == null) {
      effectKeysMap = new Map<string | symbol, DepsFn>();
      Reflect.defineMetadata('self:controller:effectkeysmap', effectKeysMap, target);
    }

    effectKeysMap.set(key, deps ?? (() => undefined));
  }

  static getStateKeys(target: Object): Array<PropertyKey> | undefined {
    return Reflect.getMetadata('self:controller:statekeys', target);
  }

  static addToStateKeys(target: Object, key: PropertyKey): void {
    let stateKeys = Reflector.getStateKeys(target);

    if (stateKeys == null) {
      stateKeys = [];
      Reflect.defineMetadata('self:controller:statekeys', stateKeys, target);
    }

    stateKeys.push(key);
  }

  static getRefKeys(target: Object): Array<PropertyKey> | undefined {
    return Reflect.getMetadata('self:controller:refkeys', target);
  }

  static addToRefKeys(target: Object, key: PropertyKey): void {
    let refKeys = Reflector.getRefKeys(target);

    if (refKeys == null) {
      refKeys = [];
      Reflect.defineMetadata('self:controller:refkeys', refKeys, target);
    }

    refKeys.push(key);
  }

  static copyMetadata(Source: Function, Target: Function): void {
    const keys = Reflect.getMetadataKeys(Source);
    keys.forEach((key) => Reflect.defineMetadata(key, Reflect.getMetadata(key, Source), Target));
  }
}
