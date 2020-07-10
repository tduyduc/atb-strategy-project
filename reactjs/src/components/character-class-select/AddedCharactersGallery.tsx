import React from 'react';
import WindowPane from '../WindowPane';

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
      return (
        <div>
          {props.allyCharacters.map(character => (
            <CharacterPane
              key={character.id}
              character={character}
              onCharacterRemoval={props.onCharacterRemoval}
              isCompletedClassLineup={props.isCompletedClassLineup}
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
  const divClassName = props.isCompletedClassLineup
    ? 'col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12'
    : 'col-xl-6';

  return (
    <div className={divClassName.concat(' character-pane')}>
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
