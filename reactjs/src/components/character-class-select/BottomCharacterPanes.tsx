import React from 'react';
import CharacterClassesGallery from './CharacterClassesGallery';
import AddedCharactersGallery from './AddedCharactersGallery';
import CharacterLineupConfirmationPane from './CharacterLineupConfirmationPane';
import { CharacterClassSelectProps } from './CharacterClassesSelectInterfaces';

class BottomCharacterPanes extends React.PureComponent<
  CharacterClassSelectProps
> {
  render(): JSX.Element {
    return this.props.isCompletedClassLineup ? (
      <div className="row">
        <div className="col-lg-3">
          <CharacterLineupConfirmationPane
            onContinuationToUnitDispatch={
              this.props.onContinuationToUnitDispatch
            }
          />
        </div>
        <div className="col-lg-9">
          <AddedCharactersGallery {...this.props} />
        </div>
      </div>
    ) : (
      <div className="row">
        <div className="col-lg-8">
          <CharacterClassesGallery {...this.props} />
        </div>
        <div className="col-lg-4">
          <AddedCharactersGallery {...this.props} />
        </div>
      </div>
    );
  }
}

export default BottomCharacterPanes;
