import { z } from 'zod';

export type TrackedCallback<T = any> = (self: T, isPending: boolean) => void;

export type Promiser = (...args: any) => Promise<any>;

export interface SchemaClass<T> {
  __schema__: z.ZodType<T>;
  new (...args: Array<any>): T;
}

export function isSchemaClass<T = any>(Class: any): Class is SchemaClass<T> {
  return Class?.__schema__ != null;
}
