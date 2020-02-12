/* Contains interfaces having static members, which are currently not declarable as TypeScript interfaces. */
/**
 * Interface for wrapping a function which calculates distance between two IPosition objects.
 *
 * @interface
 * @static
 */
class IDistanceFunction {
}
/**
 * Interface for wrapping a function which calculates damage dealt on a character.
 *
 * @interface
 * @static
 */
class IDamageFunction {
}
/**
 * Enumeration for playing mode.
 *
 * @enum
 * @readonly
 */
var PlayMode;
(function (PlayMode) {
    PlayMode[PlayMode["PLAYER_VS_AI"] = 0] = "PLAYER_VS_AI";
    PlayMode[PlayMode["AI_VS_AI_GUI"] = 1] = "AI_VS_AI_GUI";
    PlayMode[PlayMode["AI_VS_AI_FAST"] = 2] = "AI_VS_AI_FAST";
})(PlayMode || (PlayMode = {}));
/**
 * Enumeration for game AI mode.
 *
 * @enum
 * @readonly
 */
var AIMode;
(function (AIMode) {
    AIMode[AIMode["RANDOM_MOVES"] = 0] = "RANDOM_MOVES";
    AIMode[AIMode["OFFENSIVE"] = 1] = "OFFENSIVE";
    AIMode[AIMode["NINJA"] = 2] = "NINJA";
    AIMode[AIMode["MONTE_CARLO"] = 3] = "MONTE_CARLO";
    AIMode[AIMode["MINIMAX"] = 4] = "MINIMAX";
    AIMode[AIMode["MONTE_CARLO_TREE_SEARCH"] = 5] = "MONTE_CARLO_TREE_SEARCH";
})(AIMode || (AIMode = {}));
/**
 * Enumeration for current screen in the application.
 *
 * @enum
 * @readonly
 */
var AppState;
(function (AppState) {
    AppState[AppState["CLASS_SELECT"] = 0] = "CLASS_SELECT";
    AppState[AppState["DISPATCH_UNITS"] = 1] = "DISPATCH_UNITS";
    AppState[AppState["BATTLE_SCREEN"] = 2] = "BATTLE_SCREEN";
})(AppState || (AppState = {}));
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="static-interfaces.ts" />
/// <reference path="enums.ts" />
/**
 * Contains common utility functions.
 *
 * @class
 * @static
 */
class Common {
    /**
     * Generates a random Boolean value.
     *
     * @method
     * @static
     */
    static randomBool() {
        return !!Math.round(Math.random());
    }
    /**
     * Generates a random integer, from min inclusive to max exclusive.
     *
     * @method
     * @static
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
/**
 * Stores global config of the entire application.
 *
 * @class
 */
class GlobalConfig {
    constructor(arg) {
        Object.assign(this, arg);
    }
}
/**
 * Facilitates easy access to common members from AngularJS scope.
 *
 * @class
 */
class Static {
}
/**
 * Represents in-game character position in 2D.
 *
 * @class
 */
class CharacterPosition {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (x instanceof CharacterPosition) {
            Object.assign(this, x);
        }
        else {
            this.x = x;
            this.y = y;
        }
    }
}
/**
 * Static class that uses Manhattan distance formula for calculating distance between two IPosition objects.
 *
 * @class
 * @static
 */
class ManhattanDistance {
    static calculate(a, b) {
        return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    }
}
/**
 * Static class that uses damage calculation formula from League of Legends.
 *
 * @class
 * @static
 */
class DefaultDamage {
    static calculate(originalDamage, defense, variation = 0) {
        const damageMultiplier = defense >= 0 ? 100 / (100 + defense) : 2 - 100 / (100 - defense);
        const variedDamage = Math.floor(Math.random() * variation) * (Common.randomBool() ? 1 : -1);
        return originalDamage * damageMultiplier + variedDamage;
    }
}
/**
 * Stores a concrete character class. A character extends a character class.
 * @class
 * @see ICharacter
 */
class CharacterClass {
    constructor(arg) {
        Object.assign(this, arg);
    }
}
/**
 * Stores a concrete character. A character extends a character class.
 * @class
 * @see ICharacterClass
 */
class Character {
    constructor(arg) {
        Object.assign(this, arg);
        if (!arg.characterName) {
            this.characterName = this.defaultCharacterNames[Common.randomInt(0, this.defaultCharacterNames.length)];
        }
        if (!arg.inGameAttributes) {
            this.inGameAttributes = Object.assign({}, this.initialAttributes);
        }
    }
}
/**
 * Stores attributes of a character.
 * @class
 */
class CharacterAttributes {
    constructor(arg) {
        this.time = 0;
        this.position = new CharacterPosition();
        Object.assign(this, arg);
    }
}
/**
 * Facilitates generating an object that shows character attributes in friendly names.
 * @class
 * @static
 * @see AttributeFriendlyNamesObject
 * @see AttributeDisplayObject
 */
class AttributesDisplay {
    /**
     * Generate an array of attributes, with display names.
     * @static
     * @method IAttributeDisplayObject[]
     */
    static generate(actualAttributes) {
        const result = [];
        for (const field in this.friendlyNames) {
            if (!(field in actualAttributes))
                continue;
            result.push({
                name: this.friendlyNames[field],
                value: actualAttributes[field],
            });
        }
        return result;
    }
}
/**
 * Friendly names of attributes, to display.
 * @static
 * @member {IAttributeFriendlyNamesObject}
 */
AttributesDisplay.friendlyNames = {
    hp: 'HP',
    mp: 'MP',
    attack: 'Attack',
    defense: 'Defense',
    intelligence: 'Int.',
    mind: 'Mind',
    attackRange: 'Range',
    attackArea: 'Area',
    speed: 'Speed',
    movementRange: 'Move',
};
/// <reference path="classes.ts" />
const characterClasses = [
    new CharacterClass({
        className: 'Fighter',
        spritePath: 'res/cyan.gif',
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
        spritePath: 'res/sabin.gif',
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
        spritePath: 'res/edgar.gif',
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
        spritePath: 'res/shadow.gif',
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
        spritePath: 'res/relm.gif',
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
        spritePath: 'res/terra.gif',
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
        spritePath: 'res/celes.gif',
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
        spritePath: 'res/strago.gif',
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
const autoCharacterNames = characterClasses.reduce((previous, { defaultCharacterNames }) => {
    previous.push(...defaultCharacterNames);
    return previous;
}, []);
const classAttributeDisplayObjects = characterClasses.map(characterClass => AttributesDisplay.generate(characterClass.initialAttributes));
/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="classes.ts" />
/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="enums.ts" />
/// <reference path="classes.ts" />
/// <reference path="scope.ts" />
/// <reference path="character-classes.ts" />
class MainController {
    constructor(controllerFunction) {
        this._injectors = ['$scope', controllerFunction];
    }
    get injectors() {
        return this._injectors;
    }
}
function mainControllerFunction($scope) {
    globalThis.$scope = $scope;
    $scope.something = 'This is a string!';
    $scope.static = { PlayMode, AIMode, AppState, Common };
    $scope.globalConfig = {
        battleSpeed: 2,
        playMode: PlayMode.PLAYER_VS_AI,
        allyAIMode: AIMode.OFFENSIVE,
        enemyAIMode: AIMode.MONTE_CARLO,
        teamSize: 3,
        cellSize: 32,
        mapSize: 6,
        inactiveTurnLimit: 30,
    };
    $scope.setAutoName = setAutoName;
    $scope.selectCharacterClass = selectCharacterClass;
    $scope.removeLastCharacter = removeLastCharacter;
    $scope.removeAllCharacters = removeAllCharacters;
    $scope.removeCharacterByIndex = removeCharacterByIndex;
    $scope.isCompletedClassLineup = isCompletedClassLineup;
    init();
    // --- End of main logic. Internal functions start here. ---
    function init() {
        $scope.appState = AppState.CLASS_SELECT;
        $scope.inputModel = { classSelectNameInput: '' };
        $scope.characterClasses = characterClasses;
        $scope.autoCharacterNames = autoCharacterNames;
        $scope.allyCharacters = [];
        $scope.enemyCharacters = [];
        $scope.classAttributeDisplayObjects = classAttributeDisplayObjects;
    }
    function setAutoName() {
        $scope.inputModel.classSelectNameInput =
            autoCharacterNames[Common.randomInt(0, autoCharacterNames.length)];
    }
    function selectCharacterClass(characterClass) {
        $scope.allyCharacters.push(new Character(Object.assign(Object.assign({}, characterClass), { characterName: $scope.inputModel.classSelectNameInput })));
        $scope.inputModel.classSelectNameInput = '';
    }
    function removeLastCharacter() {
        $scope.allyCharacters.pop();
    }
    function removeAllCharacters() {
        $scope.allyCharacters.length = 0;
    }
    function removeCharacterByIndex(index) {
        $scope.allyCharacters.splice(index, 1);
    }
    function isCompletedClassLineup() {
        return $scope.allyCharacters.length >= $scope.globalConfig.teamSize;
    }
}
/// <reference path="definitions/angular.d/angular.d.ts" />
/// <reference path="definitions/interfaces.d.ts" />
/// <reference path="controller.ts" />
class Module {
    constructor(name, requires = []) {
        this._module = angular.module(name, requires);
    }
    get module() {
        return this._module;
    }
    controller(name, _controller) {
        return this._module.controller(name, _controller.injectors);
    }
    directive(name, _directive) {
        return this._module.directive(name, _directive.injectors);
    }
}
const app = new Module('myApp');
const mainController = new MainController(mainControllerFunction);
app.controller('mainController', mainController);
