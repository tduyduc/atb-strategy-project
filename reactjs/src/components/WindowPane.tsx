import React from 'react';

interface WindowPaneProps {
  paneTitle: string;
}

function WindowPane(
  props: React.PropsWithChildren<WindowPaneProps>
): JSX.Element {
  return (
    <fieldset>
      <legend>{props.paneTitle}</legend>
      {props.children}
    </fieldset>
  );
}

export default WindowPane;
