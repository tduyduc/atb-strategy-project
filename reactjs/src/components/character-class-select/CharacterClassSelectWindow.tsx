import React from 'react';
import WindowPane from '../WindowPane';
import CharacterClassesGallery from './CharacterClassesGallery';
import { CharacterClassSelectProps } from './CharacterClassesSelectInterfaces';
import TopStatusBar from './TopStatusBar';

class CharacterClassSelectWindow extends React.PureComponent<
  CharacterClassSelectProps
> {
  render(): JSX.Element {
    return (
      <WindowPane paneTitle="Character Class Select">
        <TopStatusBar {...this.props} />
        <div className="row">
          <CharacterClassesGallery {...this.props} />
        </div>
      </WindowPane>
    );
  }
}

export default CharacterClassSelectWindow;
