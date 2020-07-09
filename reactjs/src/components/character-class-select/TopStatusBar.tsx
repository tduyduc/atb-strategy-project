import React from 'react';
import { Common } from '../../classes/classes';
import { autoCharacterNames } from '../../classes/character-classes';
import {
  CharacterClassSelectProps,
  CharacterRemovalButtonsProps,
  CharacterNameInputProps,
  CharacterNameInputState,
  CharacterClassSelectStatusState,
} from './CharacterClassesSelectInterfaces';

function HelpText(props: CharacterClassSelectProps): JSX.Element {
  return (
    <div className="col-lg-6">
      {Common.isCompletedClassLineup(props.allyCharacters, props.teamSize)
        ? 'Character class lineup completed.'
        : 'Select classes for your characters.'}
    </div>
  );
}

function CharacterRemovalButtons(
  props: CharacterRemovalButtonsProps
): JSX.Element {
  return (
    <>
      <button
        disabled={props.isHavingNoCharacters}
        title="Change class selection of the previous character."
      >
        Back
      </button>{' '}
      <button
        disabled={props.isHavingNoCharacters}
        title="Discard all class selections and choose character classes from scratch."
      >
        Reset All
      </button>
    </>
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
      <>
        <input
          type="text"
          placeholder="Character name"
          title="Enter character name here before selecting a class. If you leave this field empty, an auto-name will be selected."
          value={this.state.characterNameInput}
        />{' '}
        <button
          onClick={this.setAutoName}
          title="Get a random name for this character."
        >
          Auto-Name
        </button>
      </>
    );
  }
}

function ControlsToolbar(props: CharacterClassSelectProps): JSX.Element {
  const isHavingNoCharacters = !Common.isCompletedClassLineup(
    props.allyCharacters,
    props.teamSize
  );
  return (
    <div className="col-lg-6 align-right">
      {!isHavingNoCharacters && <CharacterNameInput />}{' '}
      <CharacterRemovalButtons isHavingNoCharacters={isHavingNoCharacters} />
    </div>
  );
}

class TopStatusBar extends React.PureComponent<
  CharacterClassSelectProps,
  CharacterClassSelectStatusState
> {
  constructor(props: CharacterClassSelectProps) {
    super(props);
    this.state = { characterNameInput: '' };
  }

  render(): JSX.Element {
    return (
      <div className="row">
        <HelpText {...this.props} />
        <ControlsToolbar {...this.props} />
      </div>
    );
  }
}

export default TopStatusBar;
