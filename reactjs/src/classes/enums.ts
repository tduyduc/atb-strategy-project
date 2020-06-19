/**
 * Enumeration for playing mode.
 *
 * @enum
 * @readonly
 */
export enum PlayMode {
  PLAYER_VS_AI,
  AI_VS_AI_GUI,
  AI_VS_AI_FAST,
}

/**
 * Enumeration for game AI mode.
 *
 * @enum
 * @readonly
 */
export enum AIMode {
  RANDOM_MOVES,
  OFFENSIVE,
  NINJA,
  MONTE_CARLO,
  MINIMAX,
  MONTE_CARLO_TREE_SEARCH,
}

/**
 * Enumeration for current screen in the application.
 *
 * @enum
 * @readonly
 */
export enum AppState {
  CLASS_SELECT,
  UNIT_DISPATCH,
  BATTLE_SCENE,
}
