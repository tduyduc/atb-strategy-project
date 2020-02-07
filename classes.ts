/// <reference path="definitions.ts" />

/**
 * Represents in-game character position in 2D.
 *
 * @interface
 */
class CharacterPosition implements IPosition {
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Static class that uses Manhattan distance formula for calculating distance between two IPosition objects.
 *
 * @class ManhattanDistance
 * @static
 */
class ManhattanDistance implements IDistanceFunction {
  static calculate(a: CharacterPosition, b: CharacterPosition) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  }
}
