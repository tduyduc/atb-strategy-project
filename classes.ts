/// <reference path="definitions.ts" />

/**
 * Contains common utility functions.
 *
 * @class
 * @static
 */
class Common {
  static randomBool(): boolean {
    return !!Math.round(Math.random());
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
}

/**
 * Represents in-game character position in 2D.
 *
 * @class
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

class DefaultDamage implements IDamageFunction {
  static calculate(
    originalDamage: number,
    defense: number,
    variation: number = 0
  ) {
    const damageMultiplier =
      defense >= 0 ? 100 / (100 + defense) : 2 - 100 / (100 - defense);
    const variedDamage =
      Math.floor(Math.random() * variation) * (Common.randomBool() ? 1 : -1);
    return originalDamage * damageMultiplier + variedDamage;
  }
}

class Attributes implements IAttributes {
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  intelligence: number;
  mind: number;
  attackRange: number;
  attackArea: number;
  speed: number;
  movementRange: number;
  time: number;
  position: CharacterPosition;
}

class AttributeDisplayObject implements IAttributeDisplayObject {
  name: string;
  value: any;
  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

class AttributesDisplay {
  /**
   * Friendly names of attributes, to display.
   * @static
   * @member {object}
   */
  static friendlyNames = {
    hp: "HP",
    mp: "MP",
    attack: "Attack",
    defense: "Defense",
    intelligence: "Int.",
    mind: "Mind",
    attackRange: "Range",
    attackArea: "Area",
    speed: "Speed",
    movementRange: "Move"
  };

  /**
   * Generate an array of attributes, with display names.
   * @static
   * @method AttributeDisplayObject[]
   */
  static generate(attributes: Attributes): AttributeDisplayObject[] {
    const result = [];
    for (const field in this.friendlyNames) {
      if (!(field in attributes)) continue;
      result.push(
        new AttributeDisplayObject(this.friendlyNames[field], attributes[field])
      );
    }
    return result;
  }
}
