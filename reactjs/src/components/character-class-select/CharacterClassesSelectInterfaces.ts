import { Character, CharacterClass } from '../../classes/classes';
import { IAttributeDisplayObject } from '../../classes/definitions/interfaces';

export interface CharacterClassSelectProps {
  allyCharacters: Character[];
  teamSize: number;
}

export interface CharacterClassSelectStatusState {
  characterNameInput: string;
}

export interface CharacterRemovalButtonsProps {
  isHavingNoCharacters: boolean;
}

export interface CharacterNameInputProps {
  characterNameInput?: string;
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
