/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="../typescript/definitions/interfaces.d.ts" />
/// <reference path="../typescript/enums.ts" />
/// <reference path="../typescript/classes.ts" />
/// <reference path="../typescript/character-classes.ts" />
/// <reference path="scope.ts" />

/**
 * Common interface for declaring AngularJS controllers & directives.
 *
 * @interface IAngularInjectable
 */
interface IAngularInjectable<T extends Function> {
  injectors: angular.Injectable<T>;
}

interface IAngularController
  extends IAngularInjectable<angular.IControllerConstructor> {}

interface IAngularDirective
  extends IAngularInjectable<
    angular.IDirectiveFactory<
      angular.IScope,
      JQLite,
      angular.IAttributes,
      angular.IController
    >
  > {}


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
    initConfig(): void {
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
    },

    initValues(): void {
      $scope.appName = 'atb-strategy-project';
      $scope.static = { PlayMode, AIMode, AppState, Common };
      $scope.inputModel = { classSelectNameInput: '' };
      $scope.allyCharacters = [];
      $scope.enemyCharacters = [];
      Object.assign($scope, {
        characterClasses,
        autoCharacterNames,
        classAttributeDisplayObjects,
      });
    },

    setInitialAppState(): void {
      if (PlayMode.PLAYER_VS_AI === $scope.globalConfig.playMode) {
        $scope.appState = AppState.CLASS_SELECT;
        return;
      }
      // TODO: Initialize computer characters in another function to be called here!
      $scope.appState = AppState.BATTLE_SCENE;
    },

    goToClassSelectionWindow(): void {
      $scope.appState = AppState.CLASS_SELECT;
    },

    goToUnitDispatchWindow(force: boolean = false): void {
      if (!force && !$scope.isCompletedClassLineup()) return;
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
          characterClass,
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
      return $scope.allyCharacters.length === $scope.globalConfig.teamSize;
    },
  };

  // --- End of internal functions object. Main logic starts here. --- //

  (globalThis as any).$scope = $scope;

  Object.assign($scope, scopeFunctions);
  $scope.initConfig();
  $scope.initValues();
  $scope.setInitialAppState();
}
