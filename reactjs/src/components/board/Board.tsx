import React from 'react';
import Square from './Square';
import { CharacterPosition } from '../../classes/classes';
import { BoardProps } from './BoardInterfaces';
import WindowPane from '../WindowPane';

class Board extends React.PureComponent<BoardProps> {
  render() {
    return (
      <WindowPane paneTitle="Board">
        <div
          className="board"
          style={{ backgroundImage: `url(${this.props.backgroundImage})` }}
        >
          {this.generateBoardGrid(
            Math.trunc(this.props.width),
            Math.trunc(this.props.height)
          )}
        </div>
      </WindowPane>
    );
  }

  generateBoardGrid(width: number, height: number): JSX.Element {
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

  generateBoardRow(width: number, rowIndex: number): JSX.Element {
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

  generateBoardSquare(rowIndex: number, colIndex: number): JSX.Element {
    const thisPosition = new CharacterPosition({ x: colIndex, y: rowIndex });
    return (
      <Square
        character={null}
        position={thisPosition}
        isShaded={this.props.shadingFn(thisPosition)}
      />
    );
  }
}

export default Board;
