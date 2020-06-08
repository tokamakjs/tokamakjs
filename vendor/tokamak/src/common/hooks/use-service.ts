import { Type } from '../../types';

export function useService<T>(metatype: Type<T>): T {
  return new metatype();
}

export function useQuery<T>(metatype: Type<T>): T {
  return new metatype();
}
