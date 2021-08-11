import './index.css';
import React from 'react';
import { AppGlobalState } from './AppInterfaces';
import { WindowPane } from './components/WindowPane';
import { GlobalConfig, Character } from './classes/classes';
import { AppState, PlayMode, AIMode } from './classes/enums';
import { boardBackgroundPaths } from './classes/board-backgrounds';
import { assignStateBind, randomInt } from './classes/common-functions';
import { UnitDispatchWindow } from './components/unit-dispatch/UnitDispatchWindow';
import { CharacterClassSelectWindow } from './components/character-class-select/CharacterClassSelectWindow';
// import logo from './logo.svg';
// import './App.css';

const globalConfig: GlobalConfig = new GlobalConfig({
  // this object is customizable!
  battleSpeed: 2,
  playMode: PlayMode.PLAYER_VS_AI,
  allyAIMode: AIMode.OFFENSIVE,
  enemyAIMode: AIMode.MONTE_CARLO,
  teamSize: 3,
  boardSize: 6,
  inactiveTurnLimit: 30,
});

export default class App extends React.Component<
  Record<string, never>,
  AppGlobalState
> {
  override state = {
    globalConfig,
    appName: 'atb-strategy-project',
    allyCharacters: [],
    enemyCharacters: [],
    appState: AppState.CLASS_SELECT,
    boardBackgroundImage:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      boardBackgroundPaths[randomInt(0, boardBackgroundPaths.length)]!,
    ...this.getInitialAppState(globalConfig),
  };

  private assignState = assignStateBind(this);

  private getInitialAppState(
    globalConfig: GlobalConfig,
  ): Partial<AppGlobalState> {
    if (PlayMode.PLAYER_VS_AI === globalConfig.playMode) {
      return { appState: AppState.CLASS_SELECT };
    }

    // TODO: Initialize computer characters in another function to be called here!
    return { appState: AppState.BATTLE_SCENE };
  }

  private setBoardBackgroundImage() {
    this.assignState({
      boardBackgroundImage:
        boardBackgroundPaths[randomInt(0, boardBackgroundPaths.length)],
    });
  }

  private goToClassSelectionWindow() {
    this.assignState({ appState: AppState.CLASS_SELECT });
  }

  private goToUnitDispatchWindow(allyCharacters: Character[]) {
    // this also saves ally characters selected from CharacterClassSelectWindow,
    // explained in the rather long prop name, onSavingCharactersAndContinuationToUnitDispatch
    this.assignState({ appState: AppState.UNIT_DISPATCH, allyCharacters });
  }

  private goToBattleSceneWindow() {
    this.assignState({ appState: AppState.BATTLE_SCENE });
  }

  // start of rendering methods

  override render(): JSX.Element {
    switch (this.state.appState) {
      case AppState.CLASS_SELECT:
        return this.renderCharacterClassSelectWindow();

      case AppState.UNIT_DISPATCH:
        return this.renderUnitDispatchWindow();

      case AppState.BATTLE_SCENE:
        return this.renderBattleSceneWindow();

      default:
        return <div></div>;
    }
  }

  private renderCharacterClassSelectWindow(): JSX.Element {
    return (
      <div id="character-class-select-window">
        <CharacterClassSelectWindow
          allyCharacters={this.state.allyCharacters}
          teamSize={this.state.globalConfig.teamSize}
          onSavingCharactersAndContinuationToUnitDispatch={this.goToUnitDispatchWindow.bind(
            this,
          )}
        />
      </div>
    );
  }

  private renderUnitDispatchWindow(): JSX.Element {
    return (
      <div id="unit-dispatch-window">
        <UnitDispatchWindow
          allyCharacters={this.state.allyCharacters}
          boardWidth={this.state.globalConfig.boardSize}
          boardHeight={this.state.globalConfig.boardSize}
          boardBackgroundImage={this.state.boardBackgroundImage}
        />
      </div>
    );
  }

  private renderBattleSceneWindow(): JSX.Element {
    return (
      <div id="battle-scene-window">
        <WindowPane paneTitle="Battle Scene"></WindowPane>
      </div>
    );
  }
}
