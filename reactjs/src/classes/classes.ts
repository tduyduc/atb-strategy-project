import { PlayMode, AIMode } from './enums';
import {
  FilePath,
  NonEmptyArray,
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
import { getRandomArrayElement, randomBool } from './common-functions';

/**
 * Stores global config of the entire application.
 */
export class GlobalConfig implements GlobalConfigInterface {
  public readonly battleSpeed: number = 2;
  public readonly playMode: PlayMode = PlayMode.PLAYER_VS_AI;
  public readonly allyAIMode: AIMode = AIMode.OFFENSIVE;
  public readonly enemyAIMode: AIMode = AIMode.MONTE_CARLO;
  public readonly teamSize: number = 3;
  public readonly boardSize: number = 6;
  public readonly inactiveTurnLimit: number = 30;

  public constructor(arg?: GlobalConfigInterface) {
    Object.assign<this, GlobalConfigInterface | undefined>(this, arg);
  }
}

/**
 * Represents in-game character position in 2D.
 */
export class CharacterPosition implements PositionInterface {
  public constructor(
    public readonly x: number = -1,
    public readonly y: number = -1,
  ) {}

  public static from({ x, y }: PositionInterface): CharacterPosition {
    return new CharacterPosition(x, y);
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
 * Facilitates generating an object that shows character attributes in friendly names.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AttributesDisplay {
  const friendlyNames: Readonly<AttributeFriendlyNamesInterface> = {
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
  export function generate(
    actualAttributes: CharacterAttributesInterface,
  ): AttributeDisplayObjectInterface[] {
    const result: AttributeDisplayObjectInterface[] = [];
    for (const field in friendlyNames) {
      if (!(field in actualAttributes)) continue;

      result.push({
        name: friendlyNames[field as keyof AttributeFriendlyNamesInterface],
        value: actualAttributes[field as keyof CharacterAttributesInterface],
      });
    }
    return result;
  }
}

/**
 * Stores attributes of a character.
 */
export class CharacterAttributes implements CharacterAttributesInterface {
  public hp: number = 1;
  public mp: number = 1;
  public attack: number = 1;
  public defense: number = 1;
  public intelligence: number = 1;
  public mind: number = 1;
  public attackRange: number = 1;
  public attackArea: number = 0;
  public speed: number = 1;
  public movementRange: number = 1;
  public time: number = 0;
  public position: CharacterPosition;

  public constructor(arg?: CharacterAttributesInterface) {
    Object.assign<this, CharacterAttributesInterface | undefined>(this, arg);
    this.position =
      arg?.position instanceof Object
        ? CharacterPosition.from(arg.position)
        : new CharacterPosition();
  }

  public getDisplayObject(): AttributeDisplayObjectInterface[] {
    return AttributesDisplay.generate(this);
  }
}

/**
 * Stores a concrete character class. A character extends a character class.
 */
export class CharacterClass implements CharacterClassInterface {
  public readonly className: string;
  public readonly initialAttributes: CharacterAttributes;
  public readonly defaultCharacterNames: NonEmptyArray<string>;
  public readonly spritePath: FilePath;

  public constructor(arg: CharacterClassInterface) {
    this.className = arg.className;
    this.spritePath = arg.spritePath;
    this.initialAttributes = new CharacterAttributes(arg.initialAttributes);
    this.defaultCharacterNames =
      Array.isArray(arg.defaultCharacterNames) &&
      arg.defaultCharacterNames.length > 0
        ? [...arg.defaultCharacterNames]
        : [''];
  }
}

/**
 * Stores a concrete character. A character extends a character class.
 */
export class Character implements CharacterInterface {
  public readonly id: number;
  public readonly characterName: string;
  public readonly characterClass: CharacterClass;
  public inGameAttributes: CharacterAttributes;

  public constructor(arg: CharacterInterface & { id?: number }) {
    this.id = arg.id ?? Date.now();
    this.characterClass = new CharacterClass(arg.characterClass);

    this.characterName =
      arg.characterName ||
      (getRandomArrayElement(this.characterClass.defaultCharacterNames) ?? '');

    this.inGameAttributes = new CharacterAttributes(
      arg.inGameAttributes ?? this.characterClass.initialAttributes,
    );
  }
}

/**
 * Static class that uses Manhattan distance formula
 * for calculating distance between two Position objects.
 */
export const ManhattanDistance: DistanceCalculatorInterface = {
  calculate(a: PositionInterface, b: PositionInterface): number {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
  },
};

/**
 * Static class that uses damage calculation formula from League of Legends.
 */
export const DefaultDamage: DamageCalculatorInterface = {
  calculate(
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
  },
};
