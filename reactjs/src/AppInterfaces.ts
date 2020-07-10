import React from 'react';
import { AppState } from './classes/enums';
import { GlobalConfig, Character, CharacterClass } from './classes/classes';
import { FilePath } from './classes/definitions/interfaces';

export interface AppGlobalState {
  appName: string;
  globalConfig: GlobalConfig;
  appState: AppState;
  boardBackgroundImage: FilePath;

  allyCharacters: Character[];
  enemyCharacters: Character[];
}

export interface AppMethods {
  goToClassSelectionWindow: () => void;
  goToUnitDispatchWindow: (allyCharacters: Character[]) => void;
  goToBattleSceneWindow: () => void;
}

export type HTMLInputElementOnChangeCallback = (
  event: React.FormEvent<HTMLInputElement>
) => void;
