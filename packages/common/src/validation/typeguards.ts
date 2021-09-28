/**
 * Makes easier filtering `undefined` or `null` elements out
 * of an array and get the right type inferred for the returned result.
 *
 * ```ts
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
 * ```
 *
 * @category TypeGuards
 *
 * @typeParam T - Anything that can be also `null` or `undefined`.
 * @param element - Elemement of the array.
 * @returns If the element is undefined/null or not.
 */
export function isDefined<T>(element: T | null | undefined): element is T {
  return element != null;
}
