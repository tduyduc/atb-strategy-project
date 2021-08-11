import {
  FilePath,
  CharacterPosition,
} from '../../classes/definitions/interfaces';
import { Character } from '../../classes/classes';

export interface BoardProps {
  width: number;
  height: number;
  characters: Character[];
  isShaded(position: CharacterPosition): boolean;
  backgroundImage: FilePath;
}

export interface SquareProps {
  character?: Character | null;
  position: CharacterPosition;
  isShaded: boolean;
  onClick?(): void;
}
