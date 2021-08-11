import React from 'react';
import { Board } from '../board/Board';
import { WindowPane } from '../WindowPane';
import { UnitDispatchWindowProps } from './interfaces';
import { UnitDispatchTopStatusBar } from './UnitDispatchTopStatusBar';

export class UnitDispatchWindow extends React.PureComponent<UnitDispatchWindowProps> {
  render(): JSX.Element {
    return (
      <WindowPane paneTitle="Unit Dispatch">
        <UnitDispatchTopStatusBar />
        <div className="flex">
          <Board
            characters={this.props.allyCharacters}
            width={this.props.boardWidth}
            height={this.props.boardHeight}
            isShaded={() => true}
            backgroundImage={this.props.boardBackgroundImage}
          />
        </div>
      </WindowPane>
    );
  }
}
