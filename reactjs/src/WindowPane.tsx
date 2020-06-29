import React from 'react';
import './index.css';

interface WindowPaneProps {
  id?: string;
  paneTitle: string;
}

function WindowPane(
  props: React.PropsWithChildren<WindowPaneProps>
): JSX.Element {
  return (
    <fieldset id={props.id}>
      <legend>{props.paneTitle}</legend>
      {props.children}
    </fieldset>
  );
}

export default WindowPane;
