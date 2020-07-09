import { HTMLInputElementOnChangeCallback } from '../../AppInterfaces';
import { Character, CharacterClass } from '../../classes/classes';
import { IAttributeDisplayObject } from '../../classes/definitions/interfaces';

interface CharacterNameInputChangeHandler {
  onCharacterNameInputChange: HTMLInputElementOnChangeCallback;
}

interface CharacterClassSelectionHandler {
  onCharacterClassSelection: (characterClass: CharacterClass) => void;
}

interface TopStatusBarCharacterRemovalHandler {
  onCharacterBackspace: () => void;
  onCharacterResetAll: () => void;
}

interface AddedCharactersGalleryCharacterRemovalHandler {
  onCharacterRemoval: (character: Character) => void;
}

interface ContinuationToUnitDispatchHandler {
  onContinuationToUnitDispatch: () => void;
}

interface TeamInfo {
  allyCharacters: Character[];
  teamSize: number;
  isCompletedClassLineup: boolean;
}

export type CharacterClassSelectProps = TeamInfo &
  CharacterClassSelectionHandler &
  CharacterNameInputChangeHandler &
  TopStatusBarCharacterRemovalHandler &
  AddedCharactersGalleryCharacterRemovalHandler &
  ContinuationToUnitDispatchHandler;

export type CharacterRemovalButtonsProps = {
  isHavingNoCharacters: boolean;
} & TopStatusBarCharacterRemovalHandler;

export type CharacterNameInputProps = {
  characterNameInput?: string;
} & CharacterNameInputChangeHandler;

export interface CharacterNameInputState {
  characterNameInput: string;
}

export type CharacterClassesGalleryProps = TeamInfo &
  CharacterClassSelectionHandler;

export type CharacterClassPaneProps = {
  characterClass: CharacterClass;
  attributeDisplayObject: IAttributeDisplayObject[];
} & CharacterClassSelectionHandler;

export type CharacterPaneProps = {
  character: Character;
  isCompletedClassLineup: boolean;
} & AddedCharactersGalleryCharacterRemovalHandler;

export type CharacterLineupConfirmationPaneProps = ContinuationToUnitDispatchHandler;
