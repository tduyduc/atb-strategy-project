import React from 'react';
import WindowPane from '../WindowPane';
import { IAttributeDisplayObject } from '../../classes/definitions/interfaces';
import { Common, Character, CharacterClass } from '../../classes/classes';
import {
  characterClasses,
  classAttributeDisplayObjects,
} from '../../classes/character-classes';

interface CharacterClassesGalleryProps {
  allyCharacters: Character[];
  teamSize: number;
}

interface CharacterClassPaneProps {
  characterClass: CharacterClass;
  attributeDisplayObject: IAttributeDisplayObject[];
}

class CharacterClassesGallery extends React.PureComponent<
  CharacterClassesGalleryProps
> {
  render(): JSX.Element {
    const paneTitle = ''.concat(
      'Character ',
      String(this.props.allyCharacters.length + 1),
      ' / ',
      String(this.props.teamSize)
    );
    const isCompletedClassLineup = Common.isCompletedClassLineup(
      this.props.allyCharacters,
      this.props.teamSize
    );
    return (
      <div className={isCompletedClassLineup ? 'col-lg-4' : 'col-lg-8'}>
        <WindowPane paneTitle={paneTitle}>
          <div className="row">
            {characterClasses.map((characterClass, index) => (
              <CharacterClassPane
                key={index}
                characterClass={characterClass}
                attributeDisplayObject={classAttributeDisplayObjects[index]}
              />
            ))}
          </div>
        </WindowPane>
      </div>
    );
  }
}

function CharacterClassPane(props: CharacterClassPaneProps): JSX.Element {
  return (
    <div className="character-class-pane col-xl-3 col-lg-4 col-md-6 col-sm-12 col-xs-12">
      <WindowPane paneTitle={props.characterClass.className}>
        <table>
          <tbody>
            {props.attributeDisplayObject.map((attribute, index) => (
              <tr key={index}>
                <td>{attribute.name}</td>
                <td>{attribute.value}</td>
              </tr>
            ))}
            <tr>
              <td>
                <button>Select</button>
              </td>
              <td>
                <img
                  src={props.characterClass.spritePath}
                  alt={props.characterClass.className}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </WindowPane>
    </div>
  );
}

export default CharacterClassesGallery;
