import { AppState } from './classes/enums';
import { IAttributeDisplayObject } from './classes/definitions/interfaces';
import {
  GlobalConfig,
  Character,
  CharacterClass,
} from './classes/classes';

export interface AppGlobalState {
  appName: string;
  globalConfig: GlobalConfig;
  inputModel: IInputModel;
  appState: AppState;

  allyCharacters: Character[];
  enemyCharacters: Character[];
  // characterClasses: CharacterClass[];
  // autoCharacterNames: string[];
  // classAttributeDisplayObjects: IAttributeDisplayObject[][];
}

interface IInputModel {
  [x: string]: string;
}

export interface AppMethods {
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
