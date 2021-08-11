import {
  CharacterClassSelectProps,
  CharacterClassSelectState,
} from './interfaces';
import React from 'react';
import { WindowPane } from '../WindowPane';
import { BottomCharacterPanes } from './BottomCharacterPanes';
import { assignStateBind } from '../../classes/common-functions';
import { CharacterClass, Character } from '../../classes/classes';
import { CharacterClassSelectTopStatusBar } from './CharacterClassSelectTopStatusBar';

export class CharacterClassSelectWindow extends React.PureComponent<
  CharacterClassSelectProps,
  CharacterClassSelectState
> {
  constructor(props: CharacterClassSelectProps) {
    super(props);
    this.state = {
      characterNameInput: '',
      allyCharacters: this.props.allyCharacters,
    };
  }

  private assignState = assignStateBind(this);

  private isCompletedClassLineup() {
    return this.state.allyCharacters.length === this.props.teamSize;
  }

  private updateCharacterNameInput(input: string) {
    this.assignState({ characterNameInput: input });
  }

  private selectCharacterClass(characterClass: CharacterClass) {
    this.assignState({
      allyCharacters: this.state.allyCharacters.concat([
        new Character({
          characterName: this.state.characterNameInput,
          characterClass,
        }),
      ]),
    });
  }

  private removeLastCharacter() {
    this.assignState({
      allyCharacters: this.state.allyCharacters.slice(0, -1),
    });
  }

  private removeAllCharacters() {
    this.assignState({ allyCharacters: [] });
  }

  private removeCharacter(character: Character) {
    this.assignState({
      allyCharacters: this.state.allyCharacters.filter(
        current => character !== current,
      ),
    });
  }

  private continueToUnitDispatch() {
    this.props.onSavingCharactersAndContinuationToUnitDispatch(
      this.state.allyCharacters,
    );
  }

  override render(): JSX.Element {
    return (
      <WindowPane paneTitle="Character Class Select">
        <CharacterClassSelectTopStatusBar
          isCompletedClassLineup={this.isCompletedClassLineup()}
          allyCharacters={this.state.allyCharacters}
          teamSize={this.props.teamSize}
          onCharacterNameInputChange={this.updateCharacterNameInput.bind(this)}
          onCharacterBackspace={this.removeLastCharacter.bind(this)}
          onCharacterResetAll={this.removeAllCharacters.bind(this)}
        />
        <BottomCharacterPanes
          isCompletedClassLineup={this.isCompletedClassLineup()}
          allyCharacters={this.state.allyCharacters}
          teamSize={this.props.teamSize}
          onCharacterClassSelection={this.selectCharacterClass.bind(this)}
          onCharacterRemoval={this.removeCharacter.bind(this)}
          onContinuationToUnitDispatch={this.continueToUnitDispatch.bind(this)}
        />
      </WindowPane>
    );
  }
}
