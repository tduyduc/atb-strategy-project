/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="classes.ts" />

/**
 * Contains members to be included to an AngularJS scope.
 *
 * @interface
 */
interface ICustomScope extends angular.IScope {
  something: string;
  globalConfig: GlobalConfig;
  static: Static;
  inputModel: IInputModel;
  appState: AppState;

  allyCharacters: Character[];
  enemyCharacters: Character[];
  characterClasses: CharacterClass[];
  autoCharacterNames: string[];
  classAttributeDisplayObjects: IAttributeDisplayObject[][];

  initValues: () => void;
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
