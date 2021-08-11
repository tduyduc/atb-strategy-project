import React from 'react';
import { AppState } from './classes/enums';
import { FilePath } from './classes/definitions/interfaces';
import { GlobalConfig, Character } from './classes/classes';

export interface AppGlobalState {
  appName: string;
  globalConfig: GlobalConfig;
  appState: AppState;
  boardBackgroundImage: FilePath;

  allyCharacters: Character[];
  enemyCharacters: Character[];
}

export interface HTMLInputElementOnChangeCallback {
  (event: React.FormEvent<HTMLInputElement>): void;
}
