/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="classes.ts" />

/**
 * Contains members to be included in an AngularJS scope.
 *
 * @interface
 */
interface ICustomScope extends angular.IScope, ICustomScopeFunctions {
  appName: string;
  globalConfig: GlobalConfig;
  static: Static;
  inputModel: IInputModel;
  appState: AppState;

  allyCharacters: Character[];
  enemyCharacters: Character[];
  characterClasses: CharacterClass[];
  autoCharacterNames: string[];
  classAttributeDisplayObjects: IAttributeDisplayObject[][];
}

/**
 * Contains functions to be included in an AngularJS scope.
 * They are stored in a separate interface for easier declaration and copying.
 *
 * @interface
 */
interface ICustomScopeFunctions {
  initConfig: () => void;
  initValues: () => void;
  setInitialAppState: () => void;
  goToClassSelectionWindow: () => void;
  goToUnitDispatchWindow: () => void;
  goToBattleSceneWindow: () => void;

  setAutoName: () => void;
  selectCharacterClass: (characterClass: CharacterClass) => void;
  removeLastCharacter: () => void;
  removeAllCharacters: () => void;
  removeCharacterByIndex: (index: number) => void;
  isCompletedClassLineup: () => boolean;
}

/**
 * Contains fields used in input fields.
 *
 * @interface
 */
interface IInputModel {
  [x: string]: string;
}
