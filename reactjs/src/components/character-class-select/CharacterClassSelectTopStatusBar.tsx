import {
  assignStateBind,
  getRandomArrayElement,
} from '../../classes/common-functions';
import {
  CharacterNameInputProps,
  CharacterNameInputState,
  CharacterRemovalButtonsProps,
  CharacterClassSelectTopStatusBarProps,
} from './interfaces';
import React from 'react';
import { autoCharacterNames } from '../../classes/character-classes';
import { HTMLInputElementOnChangeCallback } from '../../app-interfaces';

export function CharacterClassSelectTopStatusBar(
  props: CharacterClassSelectTopStatusBarProps,
): JSX.Element {
  return (
    <div className="row">
      <HelpText {...props} />
      <ControlsToolbar {...props} />
    </div>
  );
}

function HelpText(props: CharacterClassSelectTopStatusBarProps): JSX.Element {
  return (
    <div className="col-lg-6">
      {props.isCompletedClassLineup
        ? 'Character class lineup completed.'
        : 'Select classes for your characters.'}
    </div>
  );
}

function CharacterRemovalButtons(
  props: CharacterRemovalButtonsProps,
): JSX.Element {
  return (
    <span>
      <button
        disabled={props.isHavingNoCharacters}
        onClick={props.onCharacterBackspace}
        title="Change class selection of the previous character."
      >
        Back
      </button>{' '}
      <button
        disabled={props.isHavingNoCharacters}
        onClick={props.onCharacterResetAll}
        title="Discard all class selections and choose character classes from scratch."
      >
        Reset All
      </button>
    </span>
  );
}

class CharacterNameInput extends React.PureComponent<
  CharacterNameInputProps,
  CharacterNameInputState
> {
  public constructor(props: CharacterNameInputProps) {
    super(props);
    this.state = { characterNameInput: props.characterNameInput ?? '' };
  }

  private assignState = assignStateBind(this);

  private setName(input: string) {
    this.props.onCharacterNameInputChange(input);
    this.assignState({ characterNameInput: input });
  }

  private onCharacterNameInputChange: HTMLInputElementOnChangeCallback = event =>
    this.setName(event?.currentTarget?.value ?? '');

  private setAutoName() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.setName(getRandomArrayElement(autoCharacterNames)!);
  }

  public render(): JSX.Element {
    return (
      <span>
        <input
          type="text"
          placeholder="Character name"
          title="Enter character name here before selecting a class. If you leave this field empty, an auto-name will be selected."
          value={this.state.characterNameInput}
          onChange={this.onCharacterNameInputChange.bind(this)}
        />{' '}
        <button
          onClick={this.setAutoName.bind(this)}
          title="Get a random name for this character."
        >
          Auto-Name
        </button>
      </span>
    );
  }
}

function ControlsToolbar(
  props: CharacterClassSelectTopStatusBarProps,
): JSX.Element {
  const isHavingNoCharacters = !props.allyCharacters.length;
  return (
    <div className="col-lg-6 align-right">
      {!props.isCompletedClassLineup && (
        <CharacterNameInput
          onCharacterNameInputChange={props.onCharacterNameInputChange}
        />
      )}{' '}
      <CharacterRemovalButtons
        isHavingNoCharacters={isHavingNoCharacters}
        onCharacterBackspace={props.onCharacterBackspace}
        onCharacterResetAll={props.onCharacterResetAll}
      />
    </div>
  );
}
