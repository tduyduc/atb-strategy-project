import React from 'react';
import { Common } from '../../classes/classes';
import CharacterClassesGallery from './CharacterClassesGallery';
import AddedCharactersGallery from './AddedCharactersGallery';
import { CharacterClassSelectProps } from './CharacterClassesSelectInterfaces';

class BottomCharacterPanes extends React.PureComponent<
  CharacterClassSelectProps
> {
  render(): JSX.Element {
    const isCompletedClassLineup = Common.isCompletedClassLineup(
      this.props.allyCharacters,
      this.props.teamSize
    );

    return isCompletedClassLineup ? (
      <div className="row">
        <div className="col-lg-3"></div>
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
