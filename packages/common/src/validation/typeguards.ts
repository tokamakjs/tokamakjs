/**
 * Typeguard to make easier filter undefined/null elements out
 * of an array and get the right type at the end.
 *
 * const myArray = [1, 2, undefined, 3];
 * // type is inferred as (number | undefined)[]
 *
 * // instead of:
 * const myFilteredArray = myArray.filter((v) => v != null);
 * // type is incorrectly inferred as (number | undefined)[]
 *
 * // do:
 * const myFilteredArray = myArray.filter(isDefined);
 * // type is correctly inferred as number[]
 */
export function isDefined<T>(element: T | null | undefined): element is T {
  return element != null;
}
