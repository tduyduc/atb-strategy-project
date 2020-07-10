import { Character, CharacterClass } from '../../classes/classes';
import { IAttributeDisplayObject } from '../../classes/definitions/interfaces';

type TextInputHandler = (input: string) => void;

interface CharacterNameInputChangeHandler {
  onCharacterNameInputChange: TextInputHandler;
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
}

interface TeamAdequatenessInfo {
  isCompletedClassLineup: boolean;
}

export type CharacterClassSelectProps = {
  onSavingCharactersAndContinuationToUnitDispatch: (
    allyCharacters: Character[]
  ) => void;
} & TeamInfo;

export interface CharacterClassSelectState {
  characterNameInput: string;
  allyCharacters: Character[];
}

export interface CharacterClassSelectMethods {
  updateCharacterNameInput: TextInputHandler;
  isCompletedClassLineup: () => boolean;
  selectCharacterClass: (characterClass: CharacterClass) => void;
  removeLastCharacter: () => void;
  removeAllCharacters: () => void;
  removeCharacter: (character: Character) => void;
  continueToUnitDispatch: () => void;
}

export type CharacterClassSelectTopStatusBarProps = TeamInfo &
  TeamAdequatenessInfo &
  CharacterNameInputChangeHandler &
  TopStatusBarCharacterRemovalHandler;

export type CharacterRemovalButtonsProps = {
  isHavingNoCharacters: boolean;
} & TopStatusBarCharacterRemovalHandler;

export type CharacterNameInputProps = {
  characterNameInput?: string;
} & CharacterNameInputChangeHandler;

export interface CharacterNameInputState {
  characterNameInput: string;
}

export type BottomCharacterPanesProps = TeamInfo &
  TeamAdequatenessInfo &
  CharacterClassSelectionHandler &
  AddedCharactersGalleryCharacterRemovalHandler &
  ContinuationToUnitDispatchHandler;

export type CharacterClassesGalleryProps = TeamInfo &
  TeamAdequatenessInfo &
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
