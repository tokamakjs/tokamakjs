import { Constructor } from '../types';

export interface RouteMetadata {
  view: any; // TODO: Correct typing
  controller?: Constructor;
}

export function route(metadata: RouteMetadata): ClassDecorator {
  return (target: Function): void => {
    Reflect.ownKeys(metadata).forEach((key) => {
      Reflect.defineMetadata(key, metadata[key as keyof RouteMetadata], target);
    });
  };
}
