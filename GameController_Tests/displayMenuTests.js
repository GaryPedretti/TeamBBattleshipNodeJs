const GameController = require('../GameController/gameController');
const displayMenu = require('../GameController/menu');

const assert = require('assert').strict;

describe('Display Ships', function() {
    it('should display all ships', function() {
        var ships = GameController.AllShips;
        var expected = [
            "Your ships\t\t\t\t\tOpponent ships",
            "__________\t\t\t\t\t______________",
            "Aircraft Carrier\t\t\t\tAircraft Carrier",
            "Battleship\t\t\t\t\tBattleship",
            "Submarine\t\t\t\t\tSubmarine",
            "Destroyer\t\t\t\t\tDestroyer",
            "Patrol Boat\t\t\t\t\tPatrol Boat",
            "",
        ];

        var displayShipMessage = displayMenu(ships, ships);

        assert.equal(displayShipMessage, expected);
    });
})