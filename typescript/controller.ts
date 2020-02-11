/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="enums.ts" />
/// <reference path="classes.ts" />
/// <reference path="scope.ts" />

class MainController implements IAngularInjectable {
  private _injectors: angular.Injectable<angular.IControllerConstructor>;

  constructor() {
    this._injectors = ["$scope", controller];

    function controller($scope: ICustomScope): void {
      // Testing
      globalThis.$scope = $scope;

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
      $scope.characterClasses = characterClasses;
      $scope.autoCharacterNames = autoCharacterNames;
      $scope.allyCharacters = [];
      $scope.enemyCharacters = [];
      $scope.classAttributeDisplayObjects = classAttributeDisplayObjects;
    }
  }

  get injectors() {
    return this._injectors;
  }
}
