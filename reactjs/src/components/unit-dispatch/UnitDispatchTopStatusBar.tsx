import React from 'react';

function HelpText(props: {}): JSX.Element {
  return (
    <div className="col-lg-6">
      {1
        ? 'Unit dispatching has completed.'
        : 'Click on a shaded square to select starting location.'}
    </div>
  );
}

function CharacterRemovalButtons(props: {}): JSX.Element {
  return (
    <div className="col-lg-6 align-right">
      <button
        disabled={false}
        onClick={() => {}}
        title="Change starting location of the previous character."
      >
        Back
      </button>{' '}
      <button
        disabled={false}
        onClick={() => {}}
        title="Discard all starting location selections and set locations from scratch."
      >
        Reset All
      </button>
    </div>
  );
}

function UnitDispatchTopStatusBar(props: {}): JSX.Element {
  return (
    <div className="row">
      <HelpText {...props} />
      <CharacterRemovalButtons {...props} />
    </div>
  );
}

export default UnitDispatchTopStatusBar;
