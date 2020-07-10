import { Character, CharacterPosition } from '../../classes/classes';
import { FilePath } from '../../classes/definitions/interfaces';

export interface BoardProps {
  width: number;
  height: number;
  characters: Character[];
  shadingFn: (position: CharacterPosition) => boolean;
  backgroundImage: FilePath;
}

export interface SquareProps {
  character: Character | null;
  position: CharacterPosition;
  isShaded: boolean;
  onClick?: () => void;
}
