/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="static-interfaces.ts" />

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
    return Math.floor(Math.random() * (max - min)) + min;
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
 * @class
 * @static
 */
class ManhattanDistance implements IDistanceFunction {
  static calculate(a: CharacterPosition, b: CharacterPosition) {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  }
}

/**
 * Static class that uses damage calculation formula from League of Legends.
 *
 * @class
 * @static
 */
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

/**
 * Stores attributes of a character.
 * @class
 */
class CharacterAttributes implements ICharacterAttributes {
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

/**
 * Stores friendly names of attributes.
 * @class
 */
class AttributeFriendlyNamesObject implements IAttributes {
  hp: string;
  mp: string;
  attack: string;
  defense: string;
  intelligence: string;
  mind: string;
  attackRange: string;
  attackArea: string;
  speed: string;
  movementRange: string;

  constructor(friendlyNamesObject: IAttributes) {
    Object.assign(this, friendlyNamesObject);
  }
}

/**
 * Stores a key-value pair of an attribute, but with a friendly name.
 * @class
 */
class AttributeDisplayObject implements IAttributeDisplayObject {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

/**
 * Facilitates generating an object that shows character attributes in friendly names.
 * @class
 * @static
 * @see AttributeFriendlyNamesObject
 * @see AttributeDisplayObject
 */
class AttributesDisplay {
  /**
   * Friendly names of attributes, to display.
   * @static
   * @member {AttributeFriendlyNamesObject}
   */
  static friendlyNames = new AttributeFriendlyNamesObject({
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
  });

  /**
   * Generate an array of attributes, with display names.
   * @static
   * @method AttributeDisplayObject[]
   */
  static generate(actualAttributes: IAttributes): AttributeDisplayObject[] {
    const result = [];
    for (const field in this.friendlyNames) {
      if (!(field in actualAttributes)) continue;
      result.push(
        new AttributeDisplayObject(
          this.friendlyNames[field],
          actualAttributes[field]
        )
      );
    }
    return result;
  }
}
