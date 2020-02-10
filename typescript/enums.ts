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

/**
 * Enumeration for current screen in the application.
 *
 * @enum
 * @readonly
 */
enum AppState {
  CLASS_SELECT,
  DISPATCH_UNITS,
  BATTLE_SCREEN
}
