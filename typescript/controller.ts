/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/scope.d.ts" />

class MainController implements IAngularInjectable {
  private _injectors: angular.Injectable<angular.IControllerConstructor>;

  constructor() {
    const controller = ($scope: ICustomScope): void => {
      $scope.something = "This is a string!";
      $scope.static = { PlayMode, AIMode, AppState, Common };
      $scope.globalConfig = {
        battleSpeed: 2,
        playMode: PlayMode.PLAYER_VS_AI,
        allyAIMode: AIMode.OFFENSIVE,
        enemyAIMode: AIMode.MONTE_CARLO,
        teamMembers: 3,
        cellSize: 32,
        mapSize: 6,
        inactiveTurnLimit: 30,
        appState: AppState.CLASS_SELECT
      };
    };
    this._injectors = ["$scope", controller];
  }

  get injectors() {
    return this._injectors;
  }
}
