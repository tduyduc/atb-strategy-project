import { IAttributeDisplayObject } from './definitions/interfaces';
import {
  Common,
  CharacterClass,
  CharacterAttributes,
  AttributesDisplay,
} from './classes';

export const characterClasses: Readonly<CharacterClass[]> = [
  new CharacterClass({
    className: 'Fighter',
    spritePath: Common.prependResourcePath('cyan.gif'),
    defaultCharacterNames: ['Cyan', 'Firion', 'Cecil'],
    initialAttributes: new CharacterAttributes({
      hp: 500,
      mp: 20,
      attack: 30,
      defense: 45,
      intelligence: 10,
      mind: 15,
      attackRange: 1,
      attackArea: 0,
      speed: 40,
      movementRange: 2,
    }),
  }),
  new CharacterClass({
    className: 'Black Belt',
    spritePath: Common.prependResourcePath('sabin.gif'),
    defaultCharacterNames: ['Sabin', 'Yang', 'Galuf'],
    initialAttributes: new CharacterAttributes({
      hp: 400,
      mp: 25,
      attack: 70,
      defense: 30,
      intelligence: 10,
      mind: 10,
      attackRange: 1,
      attackArea: 0,
      speed: 25,
      movementRange: 2,
    }),
  }),
  new CharacterClass({
    className: 'Archer',
    spritePath: Common.prependResourcePath('edgar.gif'),
    defaultCharacterNames: ['Edgar', 'Ceodore', 'Edward'],
    initialAttributes: new CharacterAttributes({
      hp: 300,
      mp: 300,
      attack: 30,
      defense: 15,
      intelligence: 20,
      mind: 15,
      attackRange: 3,
      attackArea: 0,
      speed: 35,
      movementRange: 2,
    }),
  }),
  new CharacterClass({
    className: 'Assassin',
    spritePath: Common.prependResourcePath('shadow.gif'),
    defaultCharacterNames: ['Shadow', 'Edge', 'Jinnai'],
    initialAttributes: new CharacterAttributes({
      hp: 250,
      mp: 20,
      attack: 45,
      defense: 15,
      intelligence: 10,
      mind: 10,
      attackRange: 1,
      attackArea: 0,
      speed: 80,
      movementRange: 3,
    }),
  }),
  new CharacterClass({
    className: 'Bomber',
    spritePath: Common.prependResourcePath('relm.gif'),
    defaultCharacterNames: ['Relm', 'Krile', 'Matoya'],
    initialAttributes: new CharacterAttributes({
      hp: 300,
      mp: 35,
      attack: 30,
      defense: 15,
      intelligence: 40,
      mind: 25,
      attackRange: 2,
      attackArea: 1,
      speed: 30,
      movementRange: 2,
    }),
  }),
  new CharacterClass({
    className: 'White Mage',
    spritePath: Common.prependResourcePath('terra.gif'),
    defaultCharacterNames: ['Terra', 'Rosa', 'Refia'],
    initialAttributes: new CharacterAttributes({
      hp: 300,
      mp: 100,
      attack: 20,
      defense: 15,
      intelligence: 50,
      mind: 30,
      attackRange: 2,
      attackArea: 1,
      speed: 30,
      movementRange: 1,
    }),
  }),
  new CharacterClass({
    className: 'Black Mage',
    spritePath: Common.prependResourcePath('celes.gif'),
    defaultCharacterNames: ['Celes', 'Rydia', 'Alba'],
    initialAttributes: new CharacterAttributes({
      hp: 300,
      mp: 200,
      attack: 20,
      defense: 15,
      intelligence: 60,
      mind: 30,
      attackRange: 2,
      attackArea: 1,
      speed: 30,
      movementRange: 1,
    }),
  }),
  new CharacterClass({
    className: 'Time Mage',
    spritePath: Common.prependResourcePath('strago.gif'),
    defaultCharacterNames: ['Strago', 'Leon', 'Palom'],
    initialAttributes: new CharacterAttributes({
      hp: 300,
      mp: 40,
      attack: 20,
      defense: 15,
      intelligence: 70,
      mind: 40,
      attackRange: 2,
      attackArea: 1,
      speed: 30,
      movementRange: 1,
    }),
  }),
];

export const autoCharacterNames: Readonly<string[]> = characterClasses.reduce(
  (result: string[], { defaultCharacterNames }: CharacterClass): string[] =>
    result.concat(defaultCharacterNames),
  []
);

export const classAttributeDisplayObjects: Readonly<IAttributeDisplayObject[][]> = characterClasses.map(
  characterClass => AttributesDisplay.generate(characterClass.initialAttributes)
);
