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
  })
];
