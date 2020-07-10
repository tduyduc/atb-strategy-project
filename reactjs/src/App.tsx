import React from 'react';
import { AppState, PlayMode, AIMode } from './classes/enums';
import { CharacterClass, Character, GlobalConfig } from './classes/classes';
import {
  AppGlobalState,
  AppMethods,
  HTMLInputElementOnChangeCallback,
} from './AppInterfaces';
import WindowPane from './components/WindowPane';
import CharacterClassSelectWindow from './components/character-class-select/CharacterClassSelectWindow';
import './index.css';
// import logo from './logo.svg';
// import './App.css';

const globalConfig: GlobalConfig = {
  // this object is customizable!
  battleSpeed: 2,
  playMode: PlayMode.PLAYER_VS_AI,
  allyAIMode: AIMode.OFFENSIVE,
  enemyAIMode: AIMode.MONTE_CARLO,
  teamSize: 3,
  cellSize: 32,
  mapSize: 6,
  inactiveTurnLimit: 30,
};

class App extends React.Component<{}, AppGlobalState> implements AppMethods {
  constructor(props: {}) {
    super(props);

    const setInitialAppState = () => {
      if (PlayMode.PLAYER_VS_AI === this.state.globalConfig.playMode) {
        this.state = this.assignState(
          { appState: AppState.CLASS_SELECT },
          false
        );
        return;
      }

      // TODO: Initialize computer characters in another function to be called here!
      this.state = this.assignState({ appState: AppState.BATTLE_SCENE }, false);
    };

    this.state = {
      globalConfig,
      appName: 'atb-strategy-project',
      allyCharacters: [],
      enemyCharacters: [],
      appState: AppState.CLASS_SELECT,
      characterNameInput: '',
    };
    setInitialAppState();
  }

  // start of prototype methods

  /**
   * `Object.assign` wrapper with type constraints for `this.state`.
   * Returns a new state reference.
   */
  assignState(
    source: Partial<AppGlobalState>,
    willSetState: boolean = true
  ): AppGlobalState {
    const newState: AppGlobalState = Object.assign<
      {},
      AppGlobalState,
      Partial<AppGlobalState>
    >({}, this.state, source);

    if (willSetState) this.setState(newState);
    return newState;
  }

  isCompletedClassLineup(): boolean {
    return (
      this.state.allyCharacters.length === this.state.globalConfig.teamSize
    );
  }

  // start of instance methods

  goToClassSelectionWindow = (): void => {
    this.assignState({ appState: AppState.CLASS_SELECT });
  };

  goToUnitDispatchWindow = (force: boolean | undefined = false): void => {
    if (!force && !this.isCompletedClassLineup()) return;
    this.assignState({ appState: AppState.UNIT_DISPATCH });
  };

  goToBattleSceneWindow = (): void => {
    this.assignState({ appState: AppState.BATTLE_SCENE });
  };

  updateCharacterNameInput: HTMLInputElementOnChangeCallback = (
    event: React.FormEvent<HTMLInputElement>
  ): void => {
    this.assignState({ characterNameInput: event?.currentTarget?.value });
  };

  selectCharacterClass = (characterClass: CharacterClass): void => {
    this.assignState({
      allyCharacters: this.state.allyCharacters.concat([
        new Character({ characterName: '', characterClass }),
      ]),
    });
  };

  removeLastCharacter = (): void => {
    this.assignState({
      allyCharacters: this.state.allyCharacters.slice(0, -1),
    });
  };

  removeAllCharacters = (): void => {
    this.assignState({ allyCharacters: [] });
  };

  removeCharacter = (character: Character): void => {
    this.assignState({
      allyCharacters: this.state.allyCharacters.filter(
        current => character !== current
      ),
    });
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
          isCompletedClassLineup={this.isCompletedClassLineup()}
          onCharacterNameInputChange={this.updateCharacterNameInput}
          onCharacterClassSelection={this.selectCharacterClass}
          onCharacterBackspace={this.removeLastCharacter}
          onCharacterResetAll={this.removeAllCharacters}
          onCharacterRemoval={this.removeCharacter}
          onContinuationToUnitDispatch={this.goToUnitDispatchWindow}
        />
      </div>
    );
  }

  renderUnitDispatchWindow(): JSX.Element {
    return (
      <div id="unit-dispatch-window">
        <WindowPane paneTitle="Unit Dispatch"></WindowPane>
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
