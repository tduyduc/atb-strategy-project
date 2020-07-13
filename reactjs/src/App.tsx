import React from 'react';
import { AppState, PlayMode, AIMode } from './classes/enums';
import { GlobalConfig, Common, Character } from './classes/classes';
import { AppGlobalState, AppMethods } from './AppInterfaces';
import WindowPane from './components/WindowPane';
import CharacterClassSelectWindow from './components/character-class-select/CharacterClassSelectWindow';
import './index.css';
import UnitDispatchWindow from './components/unit-dispatch/UnitDispatchWindow';
import { boardBackgroundPaths } from './classes/board-backgrounds';
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

class App extends React.Component<{}, AppGlobalState> implements AppMethods {
  constructor(props: {}) {
    super(props);

    this.state = Object.assign(
      {
        globalConfig,
        appName: 'atb-strategy-project',
        allyCharacters: [],
        enemyCharacters: [],
        appState: AppState.CLASS_SELECT,
        boardBackgroundImage:
          boardBackgroundPaths[
            Common.randomInt(0, boardBackgroundPaths.length)
          ],
      } as AppGlobalState,
      this.setInitialAppState(globalConfig)
    );
  }

  assignState = Common.assignStateBind(this);

  setInitialAppState = (
    globalConfig: GlobalConfig
  ): Partial<AppGlobalState> => {
    if (PlayMode.PLAYER_VS_AI === globalConfig.playMode) {
      return { appState: AppState.CLASS_SELECT };
    }

    // TODO: Initialize computer characters in another function to be called here!
    return { appState: AppState.BATTLE_SCENE };
  };

  setBoardBackgroundImage = (): void => {
    this.assignState({
      boardBackgroundImage:
        boardBackgroundPaths[Common.randomInt(0, boardBackgroundPaths.length)],
    });
  };

  goToClassSelectionWindow = (): void => {
    this.assignState({ appState: AppState.CLASS_SELECT });
  };

  goToUnitDispatchWindow = (allyCharacters: Character[]): void => {
    // this also saves ally characters selected from CharacterClassSelectWindow,
    // explained in the rather long prop name, onSavingCharactersAndContinuationToUnitDispatch
    this.assignState({ appState: AppState.UNIT_DISPATCH, allyCharacters });
  };

  goToBattleSceneWindow = (): void => {
    this.assignState({ appState: AppState.BATTLE_SCENE });
  };

  // start of rendering methods

  render(): JSX.Element {
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

  renderCharacterClassSelectWindow(): JSX.Element {
    return (
      <div id="character-class-select-window">
        <CharacterClassSelectWindow
          allyCharacters={this.state.allyCharacters}
          teamSize={this.state.globalConfig.teamSize}
          onSavingCharactersAndContinuationToUnitDispatch={
            this.goToUnitDispatchWindow
          }
        />
      </div>
    );
  }

  renderUnitDispatchWindow(): JSX.Element {
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

  renderBattleSceneWindow(): JSX.Element {
    return (
      <div id="battle-scene-window">
        <WindowPane paneTitle="Battle Scene"></WindowPane>
      </div>
    );
  }
}

export default App;
