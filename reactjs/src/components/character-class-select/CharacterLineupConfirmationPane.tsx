import React from 'react';
import { CharacterLineupConfirmationPaneProps } from './CharacterClassesSelectInterfaces';
import WindowPane from '../WindowPane';

function CharacterLineupConfirmationPane(
  props: CharacterLineupConfirmationPaneProps
): JSX.Element {
  return (
    <WindowPane paneTitle="Confirmation">
      <p>
        You have completed your character class lineup. To start organizing your
        character positions, click the button below.
      </p>
      <p className="align-center">
        <button onClick={props.onContinuationToUnitDispatch}>Continue</button>
      </p>
    </WindowPane>
  );
}

export default CharacterLineupConfirmationPane;
