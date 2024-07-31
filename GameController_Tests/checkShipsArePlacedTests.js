const assert = require('assert').strict;
const GameController = require('../GameController/gameController.js');
const gameController = require("../GameController/gameController.js");
const letters = require("../GameController/letters.js");
const position = require("../GameController/position.js")


describe('check if autopopulate is successful', function () {

    it('should show that one ship was placed', function () {
        var fleet = GameController.AutomaticallyInitializeMyFleet();
        assert.ok(fleet.length > 0);
    })

    it('should contain all the expected ships', function (){
        var fleet = GameController.AutomaticallyInitializeMyFleet();
        var shipNames = [];
        fleet.forEach(ship => {shipNames.push(ship.name)});
        var shipsExpected = [
        "Aircraft Carrier",
        "Battleship",
        "Submarine",
        "Destroyer",
        "Patrol Boat"];
        // console.log('shipNames = ',shipNames);
        // console.log('expectedShips = ', shipsExpected);
        assert.ok(shipNames.length == shipsExpected.length);
    })

})