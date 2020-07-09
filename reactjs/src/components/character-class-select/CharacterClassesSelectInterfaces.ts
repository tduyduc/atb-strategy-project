import React from 'react';
import { Character, CharacterClass } from '../../classes/classes';
import { IAttributeDisplayObject } from '../../classes/definitions/interfaces';

export interface CharacterClassSelectProps {
  allyCharacters: Character[];
  teamSize: number;
  onCharacterNameInputChange: (
    event: React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface CharacterRemovalButtonsProps {
  isHavingNoCharacters: boolean;
}

export interface CharacterNameInputProps {
  characterNameInput?: string;
  onCharacterNameInputChange: (
    event: React.FormEvent<HTMLInputElement>
  ) => void;
}

export interface CharacterNameInputState {
  characterNameInput: string;
}

export interface CharacterClassesGalleryProps {
  allyCharacters: Character[];
  teamSize: number;
}

export interface CharacterClassPaneProps {
  characterClass: CharacterClass;
  attributeDisplayObject: IAttributeDisplayObject[];
}

export interface CharacterPaneProps {
  character: Character;
}
