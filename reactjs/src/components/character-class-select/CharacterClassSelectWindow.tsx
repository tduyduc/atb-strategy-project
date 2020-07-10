import React from 'react';
import WindowPane from '../WindowPane';
import { CharacterClassSelectProps } from './CharacterClassesSelectInterfaces';
import CharacterClassSelectTopStatusBar from './CharacterClassSelectTopStatusBar';
import BottomCharacterPanes from './BottomCharacterPanes';

class CharacterClassSelectWindow extends React.PureComponent<
  CharacterClassSelectProps
> {
  render(): JSX.Element {
    return (
      <WindowPane paneTitle="Character Class Select">
        <CharacterClassSelectTopStatusBar {...this.props} />
        <BottomCharacterPanes {...this.props} />
      </WindowPane>
    );
  }
}

export default CharacterClassSelectWindow;
