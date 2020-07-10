import React from 'react';
import { CharacterClass } from '../classes/classes';

interface CharacterSpriteProps {
  characterClass: CharacterClass;
}

function CharacterSprite(props: CharacterSpriteProps): JSX.Element {
  return (
    <img
      src={props.characterClass.spritePath}
      alt={props.characterClass.className}
    />
  );
}

export default CharacterSprite;
