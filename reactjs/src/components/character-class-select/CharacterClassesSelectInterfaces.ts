import { Character } from '../../classes/classes';

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
