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

  allyCharacters: Character[];
  enemyCharacters: Character[];
  characterClasses: CharacterClass[];
  autoCharacterNames: string[];
  classAttributeDisplayObjects: IAttributeDisplayObject[][];

  classSelectNameInput: string;
  setAutoName: () => void;
  selectCharacterClass: (characterClass: CharacterClass) => void;
  removeLastCharacter: () => void;
  removeAllCharacters: () => void;
}
