import React from 'react';
import { AppState } from './classes/enums';
import { IAttributeDisplayObject } from './classes/definitions/interfaces';
import { GlobalConfig, Character, CharacterClass } from './classes/classes';

export interface AppGlobalState {
  appName: string;
  globalConfig: GlobalConfig;
  appState: AppState;
  characterNameInput: string;

  allyCharacters: Character[];
  enemyCharacters: Character[];
  // characterClasses: CharacterClass[];
  // autoCharacterNames: string[];
  // classAttributeDisplayObjects: IAttributeDisplayObject[][];
}

export interface AppMethods {
  onCharacterNameInputChange: HTMLInputElementOnChangeCallback;

  goToClassSelectionWindow: () => void;
  goToUnitDispatchWindow: () => void;
  goToBattleSceneWindow: () => void;

  selectCharacterClass: (characterClass: CharacterClass) => void;
  removeLastCharacter: () => void;
  removeAllCharacters: () => void;
  removeCharacterByIndex: (index: number) => void;
  isCompletedClassLineup: () => boolean;
}

export type HTMLInputElementOnChangeCallback = (
  event: React.FormEvent<HTMLInputElement>
) => void;
