import React from 'react';
import { AppState, PlayMode, AIMode } from './classes/enums';
import { Common, CharacterClass, Character } from './classes/classes';
import {
  characterClasses,
  autoCharacterNames,
  classAttributeDisplayObjects,
} from './classes/character-classes';
import { AppGlobalState, AppMethods } from './AppInterfaces';
import WindowPane from './components/WindowPane';
import CharacterClassSelectWindow from './components/character-class-select/CharacterClassSelectWindow';
import './index.css';
// import logo from './logo.svg';
// import './App.css';

class App extends React.Component<{}, AppGlobalState> implements AppMethods {
  constructor(props: {}) {
    const setInitialAppState = () => {
      if (PlayMode.PLAYER_VS_AI === this.state.globalConfig.playMode) {
        this.state = this.assignState({ appState: AppState.CLASS_SELECT });
        return;
      }

      // TODO: Initialize computer characters in another function to be called here!
      this.state = this.assignState({ appState: AppState.BATTLE_SCENE });
    };

    super(props);

    this.state = {
      globalConfig: {
        // this object is customizable!
        battleSpeed: 2,
        playMode: PlayMode.PLAYER_VS_AI,
        allyAIMode: AIMode.OFFENSIVE,
        enemyAIMode: AIMode.MONTE_CARLO,
        teamSize: 3,
        cellSize: 32,
        mapSize: 6,
        inactiveTurnLimit: 30,
      },
      appName: 'atb-strategy-project',
      inputModel: { classSelectNameInput: '' },
      allyCharacters: [],
      enemyCharacters: [],
      appState: AppState.CLASS_SELECT,
    };
    setInitialAppState();
  }

  /**
   * `Object.assign` wrapper with type constraints for `this.state`.
   * Returns a new state reference.
   */
  assignState(source: Partial<AppGlobalState>): AppGlobalState {
    return Object.assign<{}, AppGlobalState, Partial<AppGlobalState>>(
      {},
      this.state,
      source
    );
  }

  setInitialAppState(): void {}

  goToClassSelectionWindow(): void {
    this.setState(this.assignState({ appState: AppState.CLASS_SELECT }));
  }

  goToUnitDispatchWindow(force: boolean | undefined = false): void {
    if (!force && !this.isCompletedClassLineup()) return;
    this.setState(this.assignState({ appState: AppState.UNIT_DISPATCH }));
  }

  goToBattleSceneWindow(): void {
    this.setState(this.assignState({ appState: AppState.BATTLE_SCENE }));
  }

  setAutoName(): void {
    // this.state.inputModel.classSelectNameInput =
    // autoCharacterNames[Common.randomInt(0, autoCharacterNames.length)];
  }

  selectCharacterClass(characterClass: CharacterClass): void {
    this.setState(
      this.assignState({
        allyCharacters: this.state.allyCharacters.concat([
          new Character({ characterName: '', characterClass }),
        ]),
      })
    );
  }

  removeLastCharacter(): void {
    this.setState(
      this.assignState({
        allyCharacters: this.state.allyCharacters.slice(0, -1),
      })
    );
  }

  removeAllCharacters(): void {
    this.assignState({ allyCharacters: [] });
  }

  removeCharacterByIndex(index: number): void {
    this.setState(
      this.assignState({
        allyCharacters: this.state.allyCharacters.filter(
          (_character, characterIndex) => index !== characterIndex
        ),
      })
    );
  }

  isCompletedClassLineup(): boolean {
    return (
      this.state.allyCharacters.length === this.state.globalConfig.teamSize
    );
  }

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
        />
      </div>
    );
  }

  renderUnitDispatchWindow(): JSX.Element {
    return (
      <WindowPane
        id="unit-dispatch-window"
        paneTitle="Unit Dispatch"
      ></WindowPane>
    );
  }

  renderBattleSceneWindow(): JSX.Element {
    return (
      <WindowPane
        id="battle-scene-window"
        paneTitle="Battle Scene"
      ></WindowPane>
    );
  }
}

export default App;
