import { Character, CharacterClass } from '../../classes/classes';
import { AttributeDisplayObjectInterface } from '../../classes/definitions/interfaces';

interface TextInputHandler {
  (input: string): void;
}

interface CharacterNameInputChangeHandler {
  onCharacterNameInputChange: TextInputHandler;
}

interface CharacterClassSelectionHandler {
  onCharacterClassSelection(characterClass: CharacterClass): void;
}

interface TopStatusBarCharacterRemovalHandler {
  onCharacterBackspace(): void;
  onCharacterResetAll(): void;
}

interface AddedCharactersGalleryCharacterRemovalHandler {
  onCharacterRemoval(character: Character): void;
}

interface ContinuationToUnitDispatchHandler {
  onContinuationToUnitDispatch(): void;
}

interface TeamInfo {
  allyCharacters: Character[];
  teamSize: number;
}

interface TeamAdequatenessInfo {
  isCompletedClassLineup: boolean;
}

export interface CharacterClassSelectProps extends TeamInfo {
  onSaveCharacters(allyCharacters: Character[]): void;
}

export interface CharacterClassSelectState {
  characterNameInput: string;
  allyCharacters: Character[];
}

export interface CharacterClassSelectTopStatusBarProps
  extends TeamInfo,
    TeamAdequatenessInfo,
    CharacterNameInputChangeHandler,
    TopStatusBarCharacterRemovalHandler {}

export interface CharacterRemovalButtonsProps
  extends TopStatusBarCharacterRemovalHandler {
  isHavingNoCharacters: boolean;
}

export interface CharacterNameInputProps
  extends CharacterNameInputChangeHandler {
  characterNameInput?: string;
}

export interface CharacterNameInputState {
  characterNameInput: string;
}

export interface BottomCharacterPanesProps
  extends TeamInfo,
    TeamAdequatenessInfo,
    CharacterClassSelectionHandler,
    AddedCharactersGalleryCharacterRemovalHandler,
    ContinuationToUnitDispatchHandler {}

export interface CharacterClassesGalleryProps
  extends TeamInfo,
    TeamAdequatenessInfo,
    CharacterClassSelectionHandler {}

export interface CharacterClassPaneProps
  extends CharacterClassSelectionHandler {
  characterClass: CharacterClass;
  attributeDisplayObject: AttributeDisplayObjectInterface[];
}

export interface CharacterPaneProps
  extends AddedCharactersGalleryCharacterRemovalHandler {
  character: Character;
  isCompletedClassLineup: boolean;
}

export interface CharacterLineupConfirmationPaneProps
  extends {},
    ContinuationToUnitDispatchHandler {}
