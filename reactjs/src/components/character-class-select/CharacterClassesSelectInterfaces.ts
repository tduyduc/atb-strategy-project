import { HTMLInputElementOnChangeCallback } from '../../AppInterfaces';
import { Character, CharacterClass } from '../../classes/classes';
import { IAttributeDisplayObject } from '../../classes/definitions/interfaces';

export interface CharacterClassSelectProps {
  allyCharacters: Character[];
  teamSize: number;
  onCharacterNameInputChange: HTMLInputElementOnChangeCallback;
}

export interface CharacterRemovalButtonsProps {
  isHavingNoCharacters: boolean;
}

export interface CharacterNameInputProps {
  characterNameInput?: string;
  onCharacterNameInputChange: HTMLInputElementOnChangeCallback;
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
