import 'reflect-metadata';

import { Injectable, Module, Scope } from '@tokamakjs/injection';

import { NoControllerMetadataException, NoSubAppMetadataException } from '../exceptions';
import { ControllerMetadata, SubAppMetadata } from '../types';

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
    const { routing, providers = [], ...moduleMetadata } = metadata;
    Module({ ...moduleMetadata, providers: [...providers, ...routing.map((r) => r.controller)] })(
      target,
    );
    Reflect.defineMetadata('self:subapp', metadata, target);
  }

  static getSubAppMetadata(target: Function): SubAppMetadata {
    const metadata = Reflect.getMetadata('self:subapp', target);

    if (metadata == null) {
      throw new NoSubAppMetadataException(target.name);
    }

    return metadata;
  }
}
