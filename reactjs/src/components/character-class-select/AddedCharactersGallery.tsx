import React from 'react';
import { WindowPane } from '../WindowPane';
import { CharacterSprite } from '../CharacterSprite';
import { CharacterPaneProps, BottomCharacterPanesProps } from './interfaces';

export function AddedCharactersGallery(
  props: BottomCharacterPanesProps,
): JSX.Element {
  return (
    <WindowPane paneTitle="Added Characters">
      <CharactersGallery {...props} />
    </WindowPane>
  );
}

function CharactersGallery(props: BottomCharacterPanesProps): JSX.Element {
  if (props.allyCharacters.length > 0) {
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
  }

  return <p>None added. Add characters by selecting a character class.</p>;
}

function CharacterPane(props: CharacterPaneProps): JSX.Element {
  const divClassName = props.isCompletedClassLineup
    ? 'col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12'
    : 'col-xl-6';

  return (
    <div className={divClassName.concat(' character-pane')}>
      <WindowPane paneTitle={props.character.characterName}>
        <CharacterPaneContent {...props} />
      </WindowPane>
    </div>
  );
}

function CharacterPaneContent(props: CharacterPaneProps) {
  return (
    <div className="align-center">
      <CharacterSprite characterClass={props.character.characterClass} />
      <p>{props.character.characterClass.className}</p>
      <button onClick={onCharacterRemoval}>Remove</button>
    </div>
  );

  function onCharacterRemoval() {
    props.onCharacterRemoval(props.character);
  }
}
