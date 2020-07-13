import React from 'react';
import WindowPane from '../WindowPane';
import UnitDispatchTopStatusBar from './UnitDispatchTopStatusBar';
import Board from '../board/Board';
import { UnitDispatchWindowProps } from './UnitDispatchInterfaces';

class UnitDispatchWindow extends React.PureComponent<UnitDispatchWindowProps> {
  render(): JSX.Element {
    return (
      <WindowPane paneTitle="Unit Dispatch">
        <UnitDispatchTopStatusBar />
        <div className="flex">
          <Board
            characters={this.props.allyCharacters}
            width={this.props.boardWidth}
            height={this.props.boardHeight}
            shadingFn={() => true}
            backgroundImage={this.props.boardBackgroundImage}
          />
        </div>
      </WindowPane>
    );
  }
}

export default UnitDispatchWindow;
