import React from 'react';
import { AppState, PlayMode, AIMode } from './classes/enums';
import { CharacterClass } from './classes/classes';
import {
  characterClasses,
  autoCharacterNames,
  classAttributeDisplayObjects,
} from './classes/character-classes';
import { AppGlobalState, AppMethods } from './AppInterfaces';
import WindowPane from './WindowPane';
// import logo from './logo.svg';
// import './App.css';

class App extends React.Component<{}, AppGlobalState> implements AppMethods {
  constructor(props: {}) {
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
    this.setInitialAppState();
  }

  setInitialAppState(): void {
    console.log(this.state);
    if (PlayMode.PLAYER_VS_AI === this.state.globalConfig.playMode) {
      Object.assign<{}, AppGlobalState, Partial<AppGlobalState>>(
        {},
        this.state,
        { appState: AppState.CLASS_SELECT }
      );
      return;
    }

    // TODO: Initialize computer characters in another function to be called here!
    Object.assign<{}, AppGlobalState, Partial<AppGlobalState>>({}, this.state, {
      appState: AppState.BATTLE_SCENE,
    });
  }

  goToClassSelectionWindow(): void {}
  goToUnitDispatchWindow(): void {}
  goToBattleSceneWindow(): void {}

  setAutoName(): void {}
  selectCharacterClass(characterClass: CharacterClass): void {}
  removeLastCharacter(): void {}
  removeAllCharacters(): void {}
  removeCharacterByIndex(index: number): void {}
  isCompletedClassLineup(): boolean {
    return true;
  }

  render(): JSX.Element {
    switch (this.state.appState) {
      case AppState.CLASS_SELECT:
        return this.renderCharacterClassSelectWindow();

      case AppState.UNIT_DISPATCH:
        return this.renderUnitDispatchWindow();

      case AppState.BATTLE_SCENE:
        return <div></div>;

      default:
        return <div></div>;
    }
  }

  renderCharacterClassSelectWindow(): JSX.Element {
    return (
      <WindowPane
        id="character-class-select-window"
        paneTitle="Character Class Select"
      ></WindowPane>
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
