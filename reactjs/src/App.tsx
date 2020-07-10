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

const globalConfig: GlobalConfig = {
  // this object is customizable!
  battleSpeed: 2,
  playMode: PlayMode.PLAYER_VS_AI,
  allyAIMode: AIMode.OFFENSIVE,
  enemyAIMode: AIMode.MONTE_CARLO,
  teamSize: 3,
  boardSize: 6,
  inactiveTurnLimit: 30,
};

class App extends React.Component<{}, AppGlobalState> implements AppMethods {
  constructor(props: {}) {
    super(props);

    // must be an arrow function to prevent `this` shadowing! :(
    const setInitialAppState = () => {
      if (PlayMode.PLAYER_VS_AI === this.state.globalConfig.playMode) {
        this.state = Object.assign({}, this.state, {
          appState: AppState.CLASS_SELECT,
        });
        return;
      }

      // TODO: Initialize computer characters in another function to be called here!
      this.state = Object.assign({}, this.state, {
        appState: AppState.BATTLE_SCENE,
      });
    };

    this.state = {
      globalConfig,
      appName: 'atb-strategy-project',
      allyCharacters: [],
      enemyCharacters: [],
      appState: AppState.CLASS_SELECT,
      boardBackgroundImage:
        boardBackgroundPaths[Common.randomInt(0, boardBackgroundPaths.length)],
    };
    setInitialAppState();
  }

  assignState = Common.assignStateBind(this);

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
          characters={this.state.allyCharacters}
          width={this.state.globalConfig.boardSize}
          height={this.state.globalConfig.boardSize}
          shadingFn={() => true}
          backgroundImage={this.state.boardBackgroundImage}
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
