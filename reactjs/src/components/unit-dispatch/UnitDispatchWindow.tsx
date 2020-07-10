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
            characters={this.props.characters}
            width={this.props.width}
            height={this.props.height}
            shadingFn={this.props.shadingFn}
            backgroundImage={this.props.backgroundImage}
          />
        </div>
      </WindowPane>
    );
  }
}

export default UnitDispatchWindow;
