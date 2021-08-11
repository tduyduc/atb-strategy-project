import { Character } from '../../classes/classes';
import { FilePath } from '../../classes/definitions/interfaces';

export interface UnitDispatchWindowProps {
  boardWidth: number;
  boardHeight: number;
  allyCharacters: Character[];
  boardBackgroundImage: FilePath;
}

export interface UnitDispatchWindowState {
  allyCharacters: Character[];
  currentCharacterIndex: number;
}
