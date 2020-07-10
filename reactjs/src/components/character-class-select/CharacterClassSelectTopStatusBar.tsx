import React from 'react';
import { Common } from '../../classes/classes';
import { autoCharacterNames } from '../../classes/character-classes';
import {
  CharacterClassSelectProps,
  CharacterRemovalButtonsProps,
  CharacterNameInputProps,
  CharacterNameInputState,
} from './CharacterClassesSelectInterfaces';

function HelpText(props: CharacterClassSelectProps): JSX.Element {
  return (
    <div className="col-lg-6">
      {props.isCompletedClassLineup
        ? 'Character class lineup completed.'
        : 'Select classes for your characters.'}
    </div>
  );
}

function CharacterRemovalButtons(
  props: CharacterRemovalButtonsProps
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
  constructor(props: CharacterNameInputProps) {
    super(props);
    this.state = { characterNameInput: props.characterNameInput ?? '' };
  }

  setAutoName = (): void => {
    this.setState(prevState =>
      Object.assign<
        {},
        Readonly<CharacterNameInputState>,
        Partial<CharacterNameInputState>
      >({}, prevState, {
        characterNameInput:
          autoCharacterNames[Common.randomInt(0, autoCharacterNames.length)],
      })
    );
  };

  render(): JSX.Element {
    return (
      <span>
        <input
          type="text"
          placeholder="Character name"
          title="Enter character name here before selecting a class. If you leave this field empty, an auto-name will be selected."
          defaultValue={this.state.characterNameInput}
          onChange={this.props.onCharacterNameInputChange}
        />{' '}
        <button
          onClick={this.setAutoName}
          title="Get a random name for this character."
        >
          Auto-Name
        </button>
      </span>
    );
  }
}

function ControlsToolbar(props: CharacterClassSelectProps): JSX.Element {
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

function CharacterClassSelectTopStatusBar(
  props: CharacterClassSelectProps
): JSX.Element {
  return (
    <div className="row">
      <HelpText {...props} />
      <ControlsToolbar {...props} />
    </div>
  );
}

export default CharacterClassSelectTopStatusBar;
