import React from 'react';
import { Square } from './Square';
import { WindowPane } from '../WindowPane';
import { BoardProps } from './interfaces';
import { CharacterPosition } from '../../classes/classes';

export class Board extends React.PureComponent<BoardProps> {
  public render(): JSX.Element {
    return (
      <WindowPane paneTitle="Board">
        <div
          className="board"
          style={{ backgroundImage: `url(${this.props.backgroundImage})` }}
        >
          {this.generateBoardGrid(
            Math.trunc(this.props.width),
            Math.trunc(this.props.height),
          )}
        </div>
      </WindowPane>
    );
  }

  private generateBoardGrid(width: number, height: number): JSX.Element {
    return (
      <>
        {Array.from({ length: height }, (_element, rowIndex) => (
          <div className="board-row" key={rowIndex}>
            {this.generateBoardRow(width, rowIndex)}
          </div>
        ))}
      </>
    );
  }

  private generateBoardRow(width: number, rowIndex: number): JSX.Element {
    return (
      <>
        {Array.from({ length: width }, (_element, colIndex) => (
          <React.Fragment key={colIndex}>
            {this.generateBoardSquare(rowIndex, colIndex)}
          </React.Fragment>
        ))}
      </>
    );
  }

  private generateBoardSquare(rowIndex: number, colIndex: number): JSX.Element {
    const thisPosition = CharacterPosition.from({ x: colIndex, y: rowIndex });
    return (
      <Square
        character={null}
        position={thisPosition}
        isShaded={this.props.isShaded(thisPosition)}
      />
    );
  }
}
