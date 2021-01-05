import 'reflect-metadata';

import { Class, Injectable, Module, Scope } from '@tokamakjs/injection';

import { NoControllerMetadataException, NoSubAppMetadataException } from '../exceptions';
import { ControllerMetadata, RouteDefinition, SubAppMetadata } from '../types';

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

    const extractControllers = (routing: Array<RouteDefinition>): Array<Class> => {
      return routing.reduce((memo, r) => {
        const childrenCtrls = extractControllers(r.children);
        return [...memo, r.controller, ...childrenCtrls];
      }, [] as Array<Class>);
    };

    Module({ ...moduleMetadata, providers: [...providers, ...extractControllers(routing)] })(
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
