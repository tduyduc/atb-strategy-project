/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="enums.ts" />
/// <reference path="classes.ts" />
/// <reference path="scope.ts" />
/// <reference path="character-classes.ts" />

class MainController implements IAngularInjectable {
  private _injectors: angular.Injectable<angular.IControllerConstructor>;

  constructor(controllerFunction: ($scope: ICustomScope) => void) {
    this._injectors = ["$scope", controllerFunction];
  }

  get injectors() {
    return this._injectors;
  }
}

function mainControllerFunction($scope: ICustomScope): void {
  globalThis.$scope = $scope;

  $scope.something = "This is a string!";
  $scope.static = { PlayMode, AIMode, AppState, Common };
  $scope.globalConfig = {
    battleSpeed: 2,
    playMode: PlayMode.PLAYER_VS_AI,
    allyAIMode: AIMode.OFFENSIVE,
    enemyAIMode: AIMode.MONTE_CARLO,
    teamSize: 3,
    cellSize: 32,
    mapSize: 6,
    inactiveTurnLimit: 30
  };

  $scope.setAutoName = setAutoName;
  $scope.selectCharacterClass = selectCharacterClass;
  $scope.removeLastCharacter = removeLastCharacter;
  $scope.removeAllCharacters = removeAllCharacters;
  $scope.removeCharacterByIndex = removeCharacterByIndex;

  init();

  // --- End of main logic. Internal functions start here. ---

  function init(): void {
    $scope.appState = AppState.CLASS_SELECT;
    $scope.inputModel = { classSelectNameInput: "" };
    $scope.characterClasses = characterClasses;
    $scope.autoCharacterNames = autoCharacterNames;
    $scope.allyCharacters = [];
    $scope.enemyCharacters = [];
    $scope.classAttributeDisplayObjects = classAttributeDisplayObjects;
  }

  function setAutoName(): void {
    $scope.inputModel.classSelectNameInput =
      autoCharacterNames[Common.randomInt(0, autoCharacterNames.length)];
  }

  function selectCharacterClass(characterClass: CharacterClass): void {
    $scope.allyCharacters.push(new Character({
      ...characterClass,
      characterName: $scope.inputModel.classSelectNameInput
    }));
    $scope.inputModel.classSelectNameInput = "";
  }

  function removeLastCharacter(): void {
    $scope.allyCharacters.pop();
  }

  function removeAllCharacters(): void {
    $scope.allyCharacters.length = 0;
  }

  function removeCharacterByIndex(index: number): void {
    $scope.allyCharacters.splice(index, 1);
  }

  function isCompletedClassLineUp() {
    return $scope.allyCharacters.length >= $scope.globalConfig.teamSize;
  }
}
