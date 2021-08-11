import { PositionInterface } from './interfaces';

/* Contains interfaces having static members,
  which are currently not declarable as TypeScript interfaces. */

/**
 * Interface for wrapping a function which calculates distance
 * between two Position objects.
 */
export declare abstract class DistanceCalculatorInterface {
  /** Performs calculation using the implemented function. */
  static calculate(p1: PositionInterface, p2: PositionInterface): number;
}

/**
 * Interface for wrapping a function which calculates damage dealt on a character.
 */
export declare abstract class DamageCalculatorInterface {
  /** Performs calculation using the implemented function. */
  static calculate(
    originalDamage: number,
    defense: number,
    variation?: number,
  ): number;
}
