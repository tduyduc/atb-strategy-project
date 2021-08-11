import React from 'react';
import { Board } from '../board/Board';
import { WindowPane } from '../WindowPane';
import { CharacterPosition } from '../../classes/classes';
import { UnitDispatchTopStatusBar } from './UnitDispatchTopStatusBar';
import { UnitDispatchWindowProps, UnitDispatchWindowState } from './interfaces';

export class UnitDispatchWindow extends React.PureComponent<
  UnitDispatchWindowProps,
  UnitDispatchWindowState
> {
  public constructor(props: UnitDispatchWindowProps) {
    super(props);
    this.state = { allyCharacters: [], currentCharacterIndex: 0 };
  }

  private isSquareAvailable(position: CharacterPosition): boolean {
    return (
      position.x >=
        this.props.boardWidth - Math.trunc(this.props.boardWidth / 2) &&
      !position.isOccupied(
        this.state.allyCharacters.slice(0, this.state.currentCharacterIndex),
      )
    );
  }

  public render(): JSX.Element {
    return (
      <WindowPane paneTitle="Unit Dispatch">
        <UnitDispatchTopStatusBar />
        <div className="flex">
          <Board
            characters={this.props.allyCharacters}
            width={this.props.boardWidth}
            height={this.props.boardHeight}
            backgroundImage={this.props.boardBackgroundImage}
            isShaded={this.isSquareAvailable.bind(this)}
          />
        </div>
      </WindowPane>
    );
  }
}
