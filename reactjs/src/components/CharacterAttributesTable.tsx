import React from 'react';
import { AttributeDisplayObjectInterface } from '../classes/definitions/interfaces';

interface CharacterAttributesTableProps {
  attributeDisplayObject: AttributeDisplayObjectInterface[];
}

export function CharacterAttributesTable(
  props: React.PropsWithChildren<CharacterAttributesTableProps>,
): JSX.Element {
  return (
    <table className="character-attributes-table">
      <tbody>
        {props.attributeDisplayObject.map((attribute, index) => (
          <tr key={index}>
            <td>{attribute.name}</td>
            <td>{String(attribute.value ?? '')}</td>
          </tr>
        ))}
        {props.children}
      </tbody>
    </table>
  );
}
