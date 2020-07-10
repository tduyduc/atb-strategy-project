import * as Interfaces from './interfaces';

/* Contains interfaces having static members, which are currently not declarable as TypeScript interfaces. */

/**
 * Interface for wrapping a function which calculates distance between two IPosition objects.
 *
 * @interface
 * @static
 */
export abstract class IDistanceFunction {
  /** Performs calculation using the implemented function.
   * @method number
   * @static
   */
  static calculate: (
    p1: Interfaces.IPosition,
    p2: Interfaces.IPosition
  ) => number;
}

/**
 * Interface for wrapping a function which calculates damage dealt on a character.
 *
 * @interface
 * @static
 */
export abstract class IDamageFunction {
  /** Performs calculation using the implemented function.
   * @method number
   * @static
   */
  static calculate: (
    originalDamage: number,
    defense: number,
    variation?: number
  ) => number;
}
