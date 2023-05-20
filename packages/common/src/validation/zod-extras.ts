import { plainToClassFromExist } from 'class-transformer';
import { z } from 'zod';

import { InstantiatedDtoError, ValidationError } from '../errors';
import { SchemaClass, isSchemaClass } from '../types';

interface Class<T> {
  new (...args: Array<any>): T;
}

const VALIDATE_USED = Symbol();

function optional<T extends z.ZodTypeAny>(
  schema: T,
): z.ZodTransformer<z.ZodNullableType<z.ZodOptionalType<T>>, T['_output'] | undefined> {
  // prettier-ignore
  return schema.optional().nullable().transform((v) => v ?? undefined) as any;
}

function defaults<T extends z.ZodTypeAny>(
  schema: T,
  def: T['_output'],
): z.ZodTransformer<z.ZodNullableType<z.ZodOptionalType<T>>, T['_output']> {
  // prettier-ignore
  return schema.optional().nullable().transform((v) => v ?? def) as any;
}

function id(): z.ZodTransformer<z.ZodUnion<[z.ZodString, z.ZodNumber]>, string> {
  return z.union([z.string(), z.number()]).transform((v) => String(v));
}

/**
 * Transforms zod schemas into classes so they can be easily
 * picked up by metatype based validators.
 *
 * Ideally to be used in combination with class-transformer.
 */
function ClassFrom<T extends z.ZodTypeAny>(schema: T): SchemaClass<T['_output']> {
  return class ASchemaClass {
    public static __schema__: T = schema;

    constructor(...args: Array<any>) {
      if (args.length !== 1 || args[0] !== VALIDATE_USED) {
        throw new InstantiatedDtoError();
      }
    }
  };
}

/**
 * Validates and transforms a SchemaClass into a final class
 */
function validate<T>(SchemaClass: Class<T>, input: unknown): T {
  if (!isSchemaClass(SchemaClass)) {
    throw new ValidationError(
      `Class "${SchemaClass.name}" used to validate the input data is not a valid SchemaClass`,
    );
  }

  const result = SchemaClass.__schema__.safeParse(input);

  if (!result.success) {
    throw new ValidationError(result.error);
  }

  const base = new SchemaClass(VALIDATE_USED);
  return plainToClassFromExist(base, result.data) as T;
}

export const ze = {
  optional,
  defaults,
  id,
  ClassFrom,
  validate,
};
