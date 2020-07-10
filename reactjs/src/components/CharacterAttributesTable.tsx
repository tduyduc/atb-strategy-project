import React from 'react';
import { IAttributeDisplayObject } from '../classes/definitions/interfaces';

interface CharacterAttributesTableProps {
  attributeDisplayObject: IAttributeDisplayObject[];
}

function CharacterAttributesTable(
  props: React.PropsWithChildren<CharacterAttributesTableProps>
): JSX.Element {
  return (
    <table className="character-attributes-table">
      <tbody>
        {props.attributeDisplayObject.map((attribute, index) => (
          <tr key={index}>
            <td>{attribute.name}</td>
            <td>{attribute.value}</td>
          </tr>
        ))}
        {props.children}
      </tbody>
    </table>
  );
}

export default CharacterAttributesTable;
