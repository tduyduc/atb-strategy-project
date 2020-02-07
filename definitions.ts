/**
 * Interface for the global config object.
 *
 * @interface IGlobalConfig
 */
interface IGlobalConfig {
  battleSpeed: number;
  playMode: PlayMode;
  allyAIMode: AIMode;
  enemyAIMode: AIMode;
  teamMembers: number;
  mapSize: number;
  turnLimit: number;
}

/**
 * Represents in-game character position in 2D.
 *
 * @interface
 */
interface IPosition {
  x: number;
  y: number;
}

/**
 * Interface for wrapping a function which calculates distance between two Position objects.
 *
 * @interface
 * @static
 */
class IDistanceFunction {
  static calculate: (p1: IPosition, p2: IPosition) => number;
}

/**
 * Represents an in-game character.
 *
 * @interface
 */
interface ICharacter {
  name: string;
  initialAttributes: IAttributes;
  inGameAttributes: IAttributes;
  position: Position;
}

/**
 * Represents attributes of an in-game character.
 *
 * @interface
 */
interface IAttributes {
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
}

/**
 * Keeps track of the current game state.
 *
 * @interface
 */
interface GameState {
  turnQueue: ICharacter[];
}

/**
 * Enumeration for playing mode.
 *
 * @enum
 * @readonly
 */
enum PlayMode {
  PLAYER_VS_AI,
  AI_VS_AI_GUI,
  AI_VS_AI_FAST
}

/**
 * Enumeration for game AI mode.
 *
 * @enum
 * @readonly
 */
enum AIMode {
  RANDOM_MOVES,
  OFFENSIVE,
  NINJA,
  MONTE_CARLO,
  MINIMAX,
  MONTE_CARLO_TREE_SEARCH
}
