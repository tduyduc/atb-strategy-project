/// <reference path="classes.ts" />

const characterClasses = [
  new CharacterClass({
    className: "Fighter",
    sprite: "../res/cyan.gif",
    defaultCharacterNames: ["Cyan", "Firion", "Cecil"],
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
      movementRange: 2
    })
  }),
  new CharacterClass({
    className: "Black Belt",
    sprite: "../res/sabin.gif",
    defaultCharacterNames: ["Sabin", "Yang", "Galuf"],
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
      movementRange: 2
    })
  }),
  new CharacterClass({
    className: "Archer",
    sprite: "../res/edgar.gif",
    defaultCharacterNames: ["Edgar", "Ceodore", "Edward"],
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
      movementRange: 2
    })
  }),
  new CharacterClass({
    className: "Assassin",
    sprite: "../res/shadow.gif",
    defaultCharacterNames: ["Shadow", "Edge", "Jinnai"],
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
      movementRange: 3
    })
  }),
];
