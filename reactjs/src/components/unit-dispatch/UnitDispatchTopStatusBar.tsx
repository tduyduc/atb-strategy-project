import React from 'react';

export function UnitDispatchTopStatusBar(): JSX.Element {
  return (
    <div className="row">
      <HelpText />
      <CharacterRemovalButtons />
    </div>
  );
}

function HelpText(): JSX.Element {
  return (
    <div className="col-lg-6">
      {1
        ? 'Unit dispatching has completed.'
        : 'Click on a shaded square to select starting location.'}
    </div>
  );
}

function CharacterRemovalButtons(): JSX.Element {
  return (
    <div className="col-lg-6 align-right">
      <button
        disabled={false}
        onClick={() => void 0}
        title="Change starting location of the previous character."
      >
        Back
      </button>{' '}
      <button
        disabled={false}
        onClick={() => void 0}
        title="Discard all starting location selections and set locations from scratch."
      >
        Reset All
      </button>
    </div>
  );
}
