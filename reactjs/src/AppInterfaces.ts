import React from 'react';
import { AppState } from './classes/enums';
import { GlobalConfig, Character, CharacterClass } from './classes/classes';
import { FilePath } from './classes/definitions/interfaces';

export interface AppGlobalState {
  appName: string;
  globalConfig: GlobalConfig;
  appState: AppState;
  characterNameInput: string;
  boardBackgroundImage: FilePath;

  allyCharacters: Character[];
  enemyCharacters: Character[];
}

export interface AppMethods {
  isCompletedClassLineup: () => boolean;

  updateCharacterNameInput: HTMLInputElementOnChangeCallback;

  goToClassSelectionWindow: () => void;
  goToUnitDispatchWindow: () => void;
  goToBattleSceneWindow: () => void;

  selectCharacterClass: (characterClass: CharacterClass) => void;
  removeLastCharacter: () => void;
  removeAllCharacters: () => void;
  removeCharacter: (character: Character) => void;
}

export type HTMLInputElementOnChangeCallback = (
  event: React.FormEvent<HTMLInputElement>
) => void;
