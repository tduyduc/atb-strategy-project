import React from 'react';
import WindowPane from '../WindowPane';
import { Common } from '../../classes/classes';

import {
  CharacterClassSelectProps,
  CharacterPaneProps,
} from './CharacterClassesSelectInterfaces';

function AddedCharactersGallery(props: CharacterClassSelectProps): JSX.Element {
  return (
    <WindowPane paneTitle="Added Characters">
      {renderCharactersGallery()}
    </WindowPane>
  );

  function renderCharactersGallery(): JSX.Element {
    if (props.allyCharacters.length) {
      const divClassName = Common.isCompletedClassLineup(
        props.allyCharacters,
        props.teamSize
      )
        ? 'col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12'
        : 'col-xl-6';
      return (
        <div className={divClassName}>
          {props.allyCharacters.map((character, index) => (
            <CharacterPane
              key={index}
              character={character}
              onCharacterRemoval={props.onCharacterRemoval}
            />
          ))}
        </div>
      );
    } else {
      return <p>None added. Add characters by selecting a character class.</p>;
    }
  }
}

function CharacterPane(props: CharacterPaneProps): JSX.Element {
  return (
    <div className="character-pane">
      <WindowPane paneTitle={props.character.characterName}>
        <div className="align-center">
          <img
            src={props.character.characterClass.spritePath}
            alt={props.character.characterClass.className}
          />
          <p>{props.character.characterClass.className}</p>
          <button onClick={onCharacterRemoval}>Remove</button>
        </div>
      </WindowPane>
    </div>
  );

  function onCharacterRemoval() {
    props.onCharacterRemoval(props.character);
  }
}

export default AddedCharactersGallery;
