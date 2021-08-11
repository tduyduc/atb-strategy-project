import React from 'react';
import { SquareProps } from './interfaces';
import { CharacterSprite } from '../CharacterSprite';

export class Square extends React.PureComponent<SquareProps> {
  public render(): JSX.Element {
    return (
      <div
        className={this.props.isShaded ? 'square shaded' : 'square'}
        onClick={this.props.onClick}
      >
        {null != this.props.character && (
          <CharacterSprite
            characterClass={this.props.character.characterClass}
          />
        )}
      </div>
    );
  }
}
