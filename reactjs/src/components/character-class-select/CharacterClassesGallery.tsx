import {
  CharacterClassPaneProps,
  CharacterClassesGalleryProps,
} from './interfaces';
import React from 'react';
import { WindowPane } from '../WindowPane';
import { CharacterSprite } from '../CharacterSprite';
import { characterClasses } from '../../classes/character-classes';
import { CharacterAttributesTable } from '../CharacterAttributesTable';

export function CharacterClassesGallery(
  props: CharacterClassesGalleryProps,
): JSX.Element {
  const paneTitle = ''.concat(
    'Character ',
    String(props.allyCharacters.length + 1),
    ' / ',
    String(props.teamSize),
  );

  return (
    <WindowPane paneTitle={paneTitle}>
      <div className="row">
        {characterClasses.map((characterClass, index) => (
          <CharacterClassPane
            key={index}
            characterClass={characterClass}
            attributeDisplayObject={characterClass.initialAttributes.getDisplayObject()}
            onCharacterClassSelection={props.onCharacterClassSelection}
          />
        ))}
      </div>
    </WindowPane>
  );
}

function CharacterClassPane(props: CharacterClassPaneProps): JSX.Element {
  return (
    <div className="character-class-pane col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12">
      <WindowPane paneTitle={props.characterClass.className}>
        <CharacterAttributesTablePane {...props} />
      </WindowPane>
    </div>
  );
}

function CharacterAttributesTablePane(props: CharacterClassPaneProps) {
  return (
    <CharacterAttributesTable
      attributeDisplayObject={props.attributeDisplayObject}
    >
      <tr>
        <td>
          <button onClick={onCharacterClassSelection}>Select</button>
        </td>
        <td>
          <CharacterSprite characterClass={props.characterClass} />
        </td>
      </tr>
    </CharacterAttributesTable>
  );

  function onCharacterClassSelection() {
    props.onCharacterClassSelection(props.characterClass);
  }
}
