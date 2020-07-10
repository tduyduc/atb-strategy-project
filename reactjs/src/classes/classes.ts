import * as Interfaces from './definitions/interfaces';
import * as StaticInterfaces from './definitions/static-interfaces';
import { PlayMode, AIMode } from './enums';

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
    return Boolean(Math.round(Math.random()));
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

  static prependResourcePath(
    fileName: Interfaces.FilePath
  ): Interfaces.FilePath {
    const PATH_PREFIX: Interfaces.FilePath = './res/';
    return PATH_PREFIX + fileName;
  }
}

/**
 * Stores global config of the entire application.
 *
 * @class
 */
class GlobalConfig implements Interfaces.IGlobalConfig {
  battleSpeed: number = 2;
  playMode: PlayMode = PlayMode.PLAYER_VS_AI;
  allyAIMode: AIMode = AIMode.OFFENSIVE;
  enemyAIMode: AIMode = AIMode.MONTE_CARLO;
  teamSize: number = 3;
  boardSize: number = 6;
  inactiveTurnLimit: number = 30;

  constructor(arg?: Interfaces.IGlobalConfig) {
    Object.assign<this, Interfaces.IGlobalConfig | undefined>(this, arg);
  }
}

/**
 * Represents in-game character position in 2D.
 *
 * @class
 */
class CharacterPosition implements Interfaces.IPosition {
  x: number;
  y: number;

  constructor(x: number | Interfaces.IPosition = -1, y: number = -1) {
    if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  equals(that: Interfaces.IPosition): boolean {
    return this.x === that.x && this.y === that.y;
  }

  isOccupied(characters: Character[]): boolean {
    return characters.some(character =>
      this.equals(character.inGameAttributes.position)
    );
  }
}

/**
 * Static class that uses Manhattan distance formula for calculating distance between two IPosition objects.
 *
 * @class
 * @static
 */
class ManhattanDistance implements StaticInterfaces.IDistanceFunction {
  static calculate(a: Interfaces.IPosition, b: Interfaces.IPosition): number {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  }
}

/**
 * Static class that uses damage calculation formula from League of Legends.
 *
 * @class
 * @static
 */
class DefaultDamage implements StaticInterfaces.IDamageFunction {
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
class CharacterClass implements Interfaces.ICharacterClass {
  readonly className: string;
  readonly initialAttributes: CharacterAttributes;
  readonly defaultCharacterNames: string[];
  readonly spritePath: Interfaces.FilePath;

  constructor(arg: Interfaces.ICharacterClass) {
    this.className = arg.className;
    this.spritePath = arg.spritePath;
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
class Character implements Interfaces.ICharacter {
  readonly id: number;
  characterName: string;
  characterClass: CharacterClass;
  inGameAttributes: CharacterAttributes;

  constructor(arg: Interfaces.ICharacter) {
    this.id = Date.now();
    this.characterClass = new CharacterClass(arg.characterClass);

    this.characterName =
      arg.characterName ||
      this.characterClass.defaultCharacterNames[
        Common.randomInt(0, this.characterClass.defaultCharacterNames.length)
      ];

    this.inGameAttributes = new CharacterAttributes(
      arg.inGameAttributes ?? this.characterClass.initialAttributes
    );
  }
}

/**
 * Stores attributes of a character.
 * @class
 */
class CharacterAttributes implements Interfaces.IAttributes {
  hp: number = 1;
  mp: number = 1;
  attack: number = 1;
  defense: number = 1;
  intelligence: number = 1;
  mind: number = 1;
  attackRange: number = 1;
  attackArea: number = 0;
  speed: number = 1;
  movementRange: number = 1;
  time: number = 0;
  position: CharacterPosition;

  constructor(arg?: Interfaces.IAttributes) {
    Object.assign<this, Interfaces.IAttributes | undefined>(this, arg);
    this.position = new CharacterPosition(arg?.position ?? undefined);
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
  static friendlyNames: Readonly<Interfaces.AttributeFriendlyNamesObject> = {
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
  static generate(
    actualAttributes: Interfaces.IAttributes
  ): Interfaces.IAttributeDisplayObject[] {
    const result: Interfaces.IAttributeDisplayObject[] = [];
    for (const field in this.friendlyNames) {
      if (!(field in actualAttributes)) continue;
      result.push({
        name: this.friendlyNames[
          field as keyof Interfaces.IAttributes
        ] as string,
        value: actualAttributes[field as keyof Interfaces.IAttributes],
      });
    }
    return result;
  }
}

export {
  AttributesDisplay,
  Character,
  CharacterAttributes,
  CharacterClass,
  CharacterPosition,
  Common,
  DefaultDamage,
  GlobalConfig,
  ManhattanDistance,
};
