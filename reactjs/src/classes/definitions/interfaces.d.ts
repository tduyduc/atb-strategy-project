/* Interfaces */

/**
 * Interface for the global config object.
 */
export interface GlobalConfigInterface {
  /** Milliseconds between event ticks.
   * @member {number}
   */
  battleSpeed: number;

  /** Playing mode (e.g. single player or zero player).
   * @member {PlayMode}
   */
  playMode: PlayMode;

  /** AI mode of the ally team (applicable on AI vs. AI play mode).
   * @member {AIMode}
   */
  allyAIMode: AIMode;

  /** AI mode of the enemy team.
   * @member {AIMode}
   */
  enemyAIMode: AIMode;

  /** Number of character in a team.
   * @member {number}
   */
  teamSize: number;

  /** Number of squares per dimension in the game board.
   * @member {number}
   */
  boardSize: number;

  /** Number of consecutive inactive turns before the game is forcefully ended.
   * @member {number}
   */
  inactiveTurnLimit: number;
}

/**
 * Represents in-game character position in 2D.
 *
 * @interface
 */
export interface PositionInterface {
  /** Abscissa. */
  x: number;

  /** Ordinate. */
  y: number;
}

/**
 * Represents attributes of an in-game character.
 *
 * @interface
 */
export interface CharacterAttributesInterface {
  /**
   * Hit points.
   * Amount of damage a character can sustain before getting knocked out,
   * unable to take any further action.
   */
  hp: number;

  /**
   * Magic points. Limits how many special abilities a character can use.
   */
  mp: number;

  /**
   * Physical attack power.
   * Determines amount of damage dealt with physical attacks.
   */
  attack: number;

  /**
   * Physical defense power.
   * Determines amount of damage reduced with physical attacks.
   */
  defense: number;

  /**
   * Magical attack power.
   * Determines amount of damage dealt with magical attacks.
   */
  intelligence: number;

  /**
   * Magical defense power.
   * Determines amount of damage reduced with magical attacks.
   */
  mind: number;

  /**
   * Attack range.
   * Determines maximum distance an attack can reach from the character.
   */
  attackRange: number;

  /**
   * Attack area.
   * Determines maximum distance an attack can spread from the center of the damage position.
   */
  attackArea: number;

  /**
   * Speed. Determines how fast the ATB bar is filled.
   */
  speed: number;

  /**
   * Movement range. Determines maximum distance a character can move.
   */
  movementRange: number;

  /**
   * Time. ATB bar filling progress.
   */
  time?: number;

  /**
   * Position on the game board.
   */
  position?: PositionInterface;
}

/** Wraps a string that is designated to be a file path. */
export type FilePath = string;

/**
 * Represents an in-game character class.
 */
export interface CharacterClassInterface {
  /** Name of the character class. */
  className: string;

  /** Initial attributes of the class. */
  initialAttributes: CharacterAttributesInterface;

  /** Default character names for the class. */
  defaultCharacterNames?: string[];

  /** File path for the default sprite image of the class. */
  spritePath: FilePath;
}

/**
 * Represents an in-game character. A character must be of a character class.
 */
export interface CharacterInterface {
  /** Class to which the character belongs. */
  characterClass: CharacterClassInterface;

  /** Name of the character. */
  characterName?: string;

  /** Current attributes of the character. */
  inGameAttributes?: CharacterAttributesInterface;
}

/**
 * Interface for displaying an attribute with its friendly name and its actual value.
 *
 * @interface
 */
export interface AttributeDisplayObjectInterface {
  /** Attribute friendly name. */
  name: string;

  /** Attribute value. */
  value: unknown;
}

/**
 * Stores friendly names of attributes.
 */
export interface AttributeFriendlyNamesInterface {
  [x: keyof CharacterAttributesInterface]: string;
}

/**
 * Keeps track of the current game state.
 *
 * @interface
 */
export interface GameStateInterface {
  /** Keeps track of characters waiting to get a turn. */
  turnQueue: CharacterInterface[];
}
