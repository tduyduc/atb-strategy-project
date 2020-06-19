/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="static-interfaces.ts" />
/// <reference path="enums.ts" />

/**
 * Contains common utility functions.
 *
 * @class
 * @static
 */
class Common {
  /**
   * Generates a random Boolean value.
   *
   * @method
   * @static
   */
  static randomBool(): boolean {
    return !!Math.round(Math.random());
  }

  /**
   * Generates a random integer, from min inclusive to max exclusive.
   *
   * @method
   * @static
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

/**
 * Stores global config of the entire application.
 *
 * @class
 */
class GlobalConfig implements IGlobalConfig {
  battleSpeed: number;
  playMode: PlayMode;
  allyAIMode: AIMode;
  enemyAIMode: AIMode;
  teamSize: number;
  cellSize: number;
  mapSize: number;
  inactiveTurnLimit: number;

  constructor(arg: IGlobalConfig) {
    Object.assign(this, arg);
  }
}

/**
 * Facilitates easy access to common members from AngularJS scope.
 *
 * @class
 */
class Static {
  PlayMode: typeof PlayMode;
  AIMode: typeof AIMode;
  AppState: typeof AppState;
  Common: typeof Common;
}

/**
 * Represents in-game character position in 2D.
 *
 * @class
 */
class CharacterPosition implements IPosition {
  x: number = 0;
  y: number = 0;

  constructor(x?: number | CharacterPosition, y?: number) {
    if (x instanceof CharacterPosition) {
      Object.assign(this, x);
    } else {
      if (undefined !== x) this.x = x;
      if (undefined !== y) this.y = y;
    }
  }
}

/**
 * Static class that uses Manhattan distance formula for calculating distance between two IPosition objects.
 *
 * @class
 * @static
 */
class ManhattanDistance implements IDistanceFunction {
  static calculate(a: IPosition, b: IPosition): number {
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
  ): number {
    const damageMultiplier =
      defense >= 0 ? 100 / (100 + defense) : 2 - 100 / (100 - defense);
    const variedDamage =
      Math.random() * variation * (Common.randomBool() ? 1 : -1);
    return Math.max(
      Math.floor(originalDamage * damageMultiplier + variedDamage),
      0
    );
  }
}

/**
 * Stores a concrete character class. A character extends a character class.
 * @class
 * @see ICharacter
 */
class CharacterClass implements ICharacterClass {
  className: string;
  initialAttributes: CharacterAttributes;
  defaultCharacterNames: string[];
  spritePath: FilePath;

  constructor(arg: ICharacterClass) {
    Object.assign(this, {
      className: arg.className,
      spritePath: arg.spritePath,
    });
    this.initialAttributes = new CharacterAttributes(arg.initialAttributes);
    this.defaultCharacterNames =
      arg.defaultCharacterNames instanceof Array
        ? arg.defaultCharacterNames.slice()
        : [''];
  }
}

/**
 * Stores a concrete character. A character extends a character class.
 * @class
 * @see ICharacterClass
 */
class Character extends CharacterClass implements ICharacter {
  characterName?: string;
  inGameAttributes?: CharacterAttributes;

  constructor(arg: ICharacter) {
    super(arg);
    if (!arg.characterName) {
      this.characterName = this.defaultCharacterNames[
        Common.randomInt(0, this.defaultCharacterNames.length)
      ];
    }
    if (!(arg.inGameAttributes instanceof CharacterAttributes)) {
      this.inGameAttributes = new CharacterAttributes(this.initialAttributes);
    }
  }
}

/**
 * Stores attributes of a character.
 * @class
 */
class CharacterAttributes implements IAttributes {
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
  time: number = 0;
  position: CharacterPosition = new CharacterPosition();

  constructor(arg: IAttributes) {
    Object.assign(this, arg);
    if (arg.position instanceof CharacterPosition) {
      this.position = new CharacterPosition(arg.position);
    }
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
  static friendlyNames: AttributeFriendlyNamesObject = {
    hp: 'HP',
    mp: 'MP',
    attack: 'Attack',
    defense: 'Defense',
    intelligence: 'Int.',
    mind: 'Mind',
    attackRange: 'Range',
    attackArea: 'Area',
    speed: 'Speed',
    movementRange: 'Move',
  };

  /**
   * Generate an array of attributes, with display names.
   * @static
   * @method IAttributeDisplayObject[]
   */
  static generate(actualAttributes: IAttributes): IAttributeDisplayObject[] {
    const result: IAttributeDisplayObject[] = [];
    for (const field in this.friendlyNames) {
      if (!(field in actualAttributes)) continue;
      result.push({
        name: this.friendlyNames[field as keyof IAttributes] as string,
        value: actualAttributes[field as keyof IAttributes],
      });
    }
    return result;
  }
}