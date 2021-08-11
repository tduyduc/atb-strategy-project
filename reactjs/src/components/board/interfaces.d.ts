import { Character } from '../../classes/classes';
import { FilePath, IPosition } from '../../classes/definitions/interfaces';

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
