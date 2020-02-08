/**
 * Interface for the global config object.
 *
 * @interface IGlobalConfig
 */
interface IGlobalConfig {
  /** Milliseconds between event ticks.
   * @member {number}
   */
  battleSpeed: number;

  /** Playing mode (e.g. single player or zero player).
   * @member {PlayMode}
   */
  playMode: any;

  /** AI mode of the ally team (applicable on AI vs. AI play mode).
   * @member {AIMode}
   */
  allyAIMode: any;

  /** AI mode of the enemy team.
   * @member {AIMode}
   */
  enemyAIMode: any;

  /** Number of character in a team.
   * @member {number}
   */
  teamMembers: number;

  /** Displayed width and height of an in-game square, in pixels.
   * @member {number}
   */
  cellSize: number;

  /** Number of squares per dimension in the game board.
   * @member {number}
   */
  mapSize: number;

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
interface IPosition {
  /** Abscissa.
   * @member {number}
   */
  x: number;

  /** Ordinate.
   * @member {number}
   */
  y: number;
}

/**
 * Wraps a string that is designated to be a file path.
 *
 * @interface
 */
interface IFilePath {
  /** Wrapped file path.
   * @member {string}
   */
  filePath: string;

  /** Wrapped file path, as a helper function.
   * @method string
   */
  toString: () => string;

  /** Wrapped file path, as a helper function.
   * @method string
   */
  valueOf: () => string;
}

/**
 * Represents an in-game character class.
 *
 * @interface
 */
interface ICharacterClass {
  /**
   * Name of the character class.
   * @member {string}
   */
  className: string;

  /**
   * Initial attributes of the class.
   * @member {IAttributes}
   */
  initialAttributes: ICharacterAttributes;

  /**
   * Default character names for the class.
   * @member {string[]}
   */
  defaultCharacterNames?: string[];

  /**
   * File path for the default sprite image of the class.
   * @member {IFilePath}
   */
  sprite: IFilePath;
}

/**
 * Represents an in-game character. A character must be of a character class.
 *
 * @interface
 */
interface ICharacter extends ICharacterClass {
  /**
   * Name of the character.
   * @member {string}
   */
  characterName: string;

  /**
   * Current attributes of the character.
   * @member {IAttributes}
   */
  inGameAttributes: ICharacterAttributes;
}

/**
 * Represents attributes of an in-game character, but in a more generic way to make an "attribute friendly names" class a sub-class.
 *
 * @interface
 * @see ICharacterAttributes
 */
interface IAttributes {
  hp?: any;
  mp?: any;
  attack?: any;
  defense?: any;
  intelligence?: any;
  mind?: any;
  attackRange?: any;
  attackArea?: any;
  speed?: any;
  movementRange?: any;
  time?: any;
  position?: any;
}

/**
 * Represents attributes of an in-game character.
 *
 * @interface
 */
interface ICharacterAttributes extends IAttributes {
  /**
   * Hit points. Amount of damage a character can sustain before getting knocked out, unable to take any further action.
   * @member {number}
   */
  hp: number;

  /**
   * Magic points. Limits how many special abilities a character can use.
   * @member {number}
   */
  mp: number;

  /**
   * Physical attack power. Determines amount of damage dealt with physical attacks.
   * @member {number}
   */
  attack: number;

  /**
   * Physical defense power. Determines amount of damage reduced with physical attacks.
   * @member {number}
   */
  defense: number;

  /**
   * Magical attack power. Determines amount of damage dealt with magical attacks.
   * @member {number}
   */
  intelligence: number;

  /**
   * Magical defense power. Determines amount of damage reduced with magical attacks.
   * @member {number}
   */
  mind: number;

  /**
   * Attack range. Determines maximum distance an attack can reach from the character.
   * @member {number}
   */
  attackRange: number;

  /**
   * Attack area. Determines maximum distance an attack can spread from the center of the damage position.
   * @member {number}
   */
  attackArea: number;

  /**
   * Speed. Determines how fast the ATB bar is filled.
   * @member {number}
   */
  speed: number;

  /**
   * Movement range. Determines maximum distance a character can move.
   * @member {number}
   */
  movementRange: number;

  /**
   * Time. ATB bar filling progress.
   * @member {number}
   */
  time: number;

  /**
   * Position on the game board.
   * @member {IPosition}
   */
  position: IPosition;
}

/**
 * Interface for displaying an attribute with its friendly name and its actual value.
 *
 * @interface
 */
interface IAttributeDisplayObject {
  /** Attribute friendly name.
   * @member {number}
   */
  name: string;

  /** Attribute value.
   * @member {any}
   */
  value: any;
}

/**
 * Keeps track of the current game state.
 *
 * @interface
 */
interface IGameState {
  /**
   * Keeps track of character waiting to get a turn
   * @member {ICharacter[]}
   */
  turnQueue: ICharacter[];
}
