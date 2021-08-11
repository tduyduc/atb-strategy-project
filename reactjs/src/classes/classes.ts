import { PlayMode, AIMode } from './enums';
import {
  FilePath,
  PositionInterface,
  CharacterInterface,
  GlobalConfigInterface,
  CharacterClassInterface,
  CharacterAttributesInterface,
  AttributeDisplayObjectInterface,
  AttributeFriendlyNamesInterface,
} from './definitions/interfaces';
import {
  DamageCalculatorInterface,
  DistanceCalculatorInterface,
} from './definitions/static-interfaces';
import { randomBool, randomInt } from './common-functions';

/**
 * Stores global config of the entire application.
 */
export class GlobalConfig implements GlobalConfigInterface {
  battleSpeed: number = 2;
  playMode: PlayMode = PlayMode.PLAYER_VS_AI;
  allyAIMode: AIMode = AIMode.OFFENSIVE;
  enemyAIMode: AIMode = AIMode.MONTE_CARLO;
  teamSize: number = 3;
  boardSize: number = 6;
  inactiveTurnLimit: number = 30;

  constructor(arg?: GlobalConfigInterface) {
    Object.assign<this, GlobalConfigInterface | undefined>(this, arg);
  }
}

/**
 * Represents in-game character position in 2D.
 */
export class CharacterPosition implements PositionInterface {
  x: number;
  y: number;

  constructor(x: number | PositionInterface = -1, y: number = -1) {
    if (typeof x === 'object') {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }

  equals(that: PositionInterface): boolean {
    return this.x === that.x && this.y === that.y;
  }

  // eslint-disable-next-line no-use-before-define
  isOccupied(characters: Character[]): boolean {
    return characters.some(character =>
      this.equals(character.inGameAttributes.position),
    );
  }
}

/**
 * Stores attributes of a character.
 */
export class CharacterAttributes implements CharacterAttributesInterface {
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

  constructor(arg?: CharacterAttributesInterface) {
    Object.assign<this, CharacterAttributesInterface | undefined>(this, arg);
    this.position = new CharacterPosition(arg?.position ?? undefined);
  }
}

/**
 * Stores a concrete character class. A character extends a character class.
 */
export class CharacterClass implements CharacterClassInterface {
  readonly className: string;
  readonly initialAttributes: CharacterAttributes;
  readonly defaultCharacterNames: string[];
  readonly spritePath: FilePath;

  constructor(arg: CharacterClassInterface) {
    this.className = arg.className;
    this.spritePath = arg.spritePath;
    this.initialAttributes = new CharacterAttributes(arg.initialAttributes);
    this.defaultCharacterNames = Array.isArray(arg.defaultCharacterNames)
      ? arg.defaultCharacterNames.slice()
      : [''];
  }
}

/**
 * Stores a concrete character. A character extends a character class.
 */
export class Character implements CharacterInterface {
  readonly id: number;
  characterName: string;
  characterClass: CharacterClass;
  inGameAttributes: CharacterAttributes;

  constructor(arg: CharacterInterface) {
    this.id = Date.now();
    this.characterClass = new CharacterClass(arg.characterClass);

    this.characterName =
      arg.characterName ||
      this.characterClass.defaultCharacterNames[
        randomInt(0, this.characterClass.defaultCharacterNames.length)
      ];

    this.inGameAttributes = new CharacterAttributes(
      arg.inGameAttributes ?? this.characterClass.initialAttributes,
    );
  }
}

/**
 * Static class that uses Manhattan distance formula
 * for calculating distance between two Position objects.
 */
export class ManhattanDistance implements DistanceCalculatorInterface {
  static calculate(a: PositionInterface, b: PositionInterface): number {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  }
}

/**
 * Static class that uses damage calculation formula from League of Legends.
 */
export class DefaultDamage implements DamageCalculatorInterface {
  static calculate(
    originalDamage: number,
    defense: number,
    variation: number = 0,
  ): number {
    const damageMultiplier =
      defense >= 0 ? 100 / (100 + defense) : 2 - 100 / (100 - defense);
    const variedDamage = Math.random() * variation * (randomBool() ? 1 : -1);
    return Math.max(
      Math.floor(originalDamage * damageMultiplier + variedDamage),
      0,
    );
  }
}

/**
 * Facilitates generating an object that shows character attributes in friendly names.
 */
export class AttributesDisplay {
  /**
   * Friendly names of attributes, to display.
   */
  static friendlyNames: Readonly<AttributeFriendlyNamesInterface> = {
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
   */
  static generate(
    actualAttributes: CharacterAttributesInterface,
  ): AttributeDisplayObjectInterface[] {
    const result: AttributeDisplayObjectInterface[] = [];
    for (const field in this.friendlyNames) {
      if (!(field in actualAttributes)) continue;

      result.push({
        name: this.friendlyNames[
          field as keyof AttributeFriendlyNamesInterface
        ],
        value: actualAttributes[field as keyof CharacterAttributesInterface],
      });
    }
    return result;
  }
}
