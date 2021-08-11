import React from 'react';
import { BottomCharacterPanesProps } from './interfaces';
import { AddedCharactersGallery } from './AddedCharactersGallery';
import { CharacterClassesGallery } from './CharacterClassesGallery';
import { CharacterLineupConfirmationPane } from './CharacterLineupConfirmationPane';

export class BottomCharacterPanes extends React.PureComponent<BottomCharacterPanesProps> {
  public render(): JSX.Element {
    return this.props.isCompletedClassLineup
      ? this.renderCompleteClassLineupGallery()
      : this.renderIncompleteClassLineup();
  }

  private renderCompleteClassLineupGallery(): JSX.Element {
    return (
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
    );
  }

  private renderIncompleteClassLineup(): JSX.Element {
    return (
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
