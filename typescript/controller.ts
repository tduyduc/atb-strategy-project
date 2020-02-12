/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="enums.ts" />
/// <reference path="classes.ts" />
/// <reference path="scope.ts" />
/// <reference path="character-classes.ts" />

class MainController implements IAngularController {
  private _injectors: angular.Injectable<angular.IControllerConstructor>;

  constructor(controllerFunction: ($scope: ICustomScope) => void) {
    this._injectors = ['$scope', controllerFunction];
  }

  get injectors() {
    return this._injectors;
  }
}

function mainControllerFunction($scope: ICustomScope): void {
  const scopeFunctions: ICustomScopeFunctions = {
    initValues(): void {
      $scope.appState = AppState.CLASS_SELECT;
      $scope.inputModel = { classSelectNameInput: '' };
      $scope.characterClasses = characterClasses;
      $scope.autoCharacterNames = autoCharacterNames;
      $scope.allyCharacters = [];
      $scope.enemyCharacters = [];
      $scope.classAttributeDisplayObjects = classAttributeDisplayObjects;
    },

    goToClassSelectionWindow(): void {
      $scope.appState = AppState.CLASS_SELECT;
    },

    goToUnitDispatchWindow(): void {
      if (!$scope.isCompletedClassLineup()) return;
      $scope.appState = AppState.UNIT_DISPATCH;
    },

    goToBattleSceneWindow(): void {
      $scope.appState = AppState.BATTLE_SCENE;
    },

    setAutoName(): void {
      $scope.inputModel.classSelectNameInput =
        autoCharacterNames[Common.randomInt(0, autoCharacterNames.length)];
    },

    selectCharacterClass(characterClass: CharacterClass): void {
      $scope.allyCharacters.push(
        new Character({
          ...characterClass,
          characterName: $scope.inputModel.classSelectNameInput,
        })
      );
      $scope.inputModel.classSelectNameInput = '';
    },

    removeLastCharacter(): void {
      $scope.allyCharacters.pop();
    },

    removeAllCharacters(): void {
      $scope.allyCharacters.length = 0;
    },

    removeCharacterByIndex(index: number): void {
      $scope.allyCharacters.splice(index, 1);
    },

    isCompletedClassLineup(): boolean {
      return $scope.allyCharacters.length >= $scope.globalConfig.teamSize;
    },
  };

  // --- End of internal functions object. Main logic starts here. --- //

  globalThis.$scope = $scope;

  $scope.something = 'This is a string!';
  $scope.static = { PlayMode, AIMode, AppState, Common };
  $scope.globalConfig = {
    battleSpeed: 2,
    playMode: PlayMode.PLAYER_VS_AI,
    allyAIMode: AIMode.OFFENSIVE,
    enemyAIMode: AIMode.MONTE_CARLO,
    teamSize: 3,
    cellSize: 32,
    mapSize: 6,
    inactiveTurnLimit: 30,
  };

  Object.assign($scope, scopeFunctions);
  $scope.initValues();
}
