const position = require("./position.js");
const letters = require("./letters.js");


class GameController {
    static InitializeShips() {
        var colors = require("cli-color");
        const Ship = require("./ship.js");
        var ships = [
            new Ship("Aircraft Carrier", 5, colors.CadetBlue),
            new Ship("Battleship", 4, colors.Red),
            new Ship("Submarine", 3, colors.Chartreuse),
            new Ship("Destroyer", 3, colors.Yellow),
            new Ship("Patrol Boat", 2, colors.Orange)
        ];
        return ships;
    }

    static CheckIsHit(ships, shot) {
        if (shot == undefined)
            throw "The shooting position is not defined";
        if (ships == undefined)
            throw "No ships defined";
        var returnvalue = false;
        ships.forEach(function (ship) {
            ship.positions.forEach(position => {
                if (position.row == shot.row && position.column == shot.column)
                    returnvalue = true;
            });
        });
        return returnvalue;
    }

    static isShipValid(ship) {
        return ship.positions.length == ship.size;
    }

    static AutomaticallyInitializeMyFleet(){
        this.myFleet = GameController.InitializeShips();

        this.myFleet[0].addPosition(new position(letters.B, 4));
        this.myFleet[0].addPosition(new position(letters.B, 5));
        this.myFleet[0].addPosition(new position(letters.B, 6));
        this.myFleet[0].addPosition(new position(letters.B, 7));
        this.myFleet[0].addPosition(new position(letters.B, 8));

        this.myFleet[1].addPosition(new position(letters.E, 6));
        this.myFleet[1].addPosition(new position(letters.E, 7));
        this.myFleet[1].addPosition(new position(letters.E, 8));
        this.myFleet[1].addPosition(new position(letters.E, 9));

        this.myFleet[2].addPosition(new position(letters.A, 3));
        this.myFleet[2].addPosition(new position(letters.B, 3));
        this.myFleet[2].addPosition(new position(letters.C, 3));

        this.myFleet[3].addPosition(new position(letters.F, 8));
        this.myFleet[3].addPosition(new position(letters.G, 8));
        this.myFleet[3].addPosition(new position(letters.H, 8));

        this.myFleet[4].addPosition(new position(letters.C, 5));
        this.myFleet[4].addPosition(new position(letters.C, 6));
        
        return this.myFleet;
    }
}

module.exports = GameController;