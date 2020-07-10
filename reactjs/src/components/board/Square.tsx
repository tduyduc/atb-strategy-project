import React from 'react';
import CharacterSprite from '../CharacterSprite';
import { SquareProps } from './BoardInterfaces';

class Square extends React.PureComponent<SquareProps> {
  render(): JSX.Element {
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

export default Square;
