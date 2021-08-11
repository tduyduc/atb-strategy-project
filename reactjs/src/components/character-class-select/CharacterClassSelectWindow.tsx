import {
  CharacterClassSelectProps,
  CharacterClassSelectState,
  CharacterClassSelectMethods,
} from './interfaces';
import React from 'react';
import { WindowPane } from '../WindowPane';
import { BottomCharacterPanes } from './BottomCharacterPanes';
import { assignStateBind } from '../../classes/common-functions';
import { CharacterClass, Character } from '../../classes/classes';
import { CharacterClassSelectTopStatusBar } from './CharacterClassSelectTopStatusBar';

export class CharacterClassSelectWindow
  extends React.PureComponent<
    CharacterClassSelectProps,
    CharacterClassSelectState
  >
  implements CharacterClassSelectMethods
{
  constructor(props: CharacterClassSelectProps) {
    super(props);
    this.state = {
      characterNameInput: '',
      allyCharacters: this.props.allyCharacters,
    };
  }

  assignState = assignStateBind(this);

  isCompletedClassLineup = (): boolean =>
    this.state.allyCharacters.length === this.props.teamSize;

  updateCharacterNameInput = (input: string): void => {
    this.assignState({ characterNameInput: input });
  };

  selectCharacterClass = (characterClass: CharacterClass): void => {
    this.assignState({
      allyCharacters: this.state.allyCharacters.concat([
        new Character({
          characterName: this.state.characterNameInput,
          characterClass,
        }),
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
        current => character !== current,
      ),
    });
  };

  continueToUnitDispatch = (): void => {
    this.props.onSavingCharactersAndContinuationToUnitDispatch(
      this.state.allyCharacters,
    );
  };

  render(): JSX.Element {
    return (
      <WindowPane paneTitle="Character Class Select">
        <CharacterClassSelectTopStatusBar
          isCompletedClassLineup={this.isCompletedClassLineup()}
          allyCharacters={this.state.allyCharacters}
          teamSize={this.props.teamSize}
          onCharacterNameInputChange={this.updateCharacterNameInput}
          onCharacterBackspace={this.removeLastCharacter}
          onCharacterResetAll={this.removeAllCharacters}
        />
        <BottomCharacterPanes
          isCompletedClassLineup={this.isCompletedClassLineup()}
          allyCharacters={this.state.allyCharacters}
          teamSize={this.props.teamSize}
          onCharacterClassSelection={this.selectCharacterClass}
          onCharacterRemoval={this.removeCharacter}
          onContinuationToUnitDispatch={this.continueToUnitDispatch}
        />
      </WindowPane>
    );
  }
}
