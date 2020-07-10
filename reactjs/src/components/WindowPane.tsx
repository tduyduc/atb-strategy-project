import React from 'react';

interface WindowPaneProps {
  paneTitle: string;
  disabled?: boolean;
}

function WindowPane(
  props: React.PropsWithChildren<WindowPaneProps>
): JSX.Element {
  return (
    <fieldset disabled={props.disabled}>
      <legend>{props.paneTitle}</legend>
      {props.children}
    </fieldset>
  );
}

export default WindowPane;
