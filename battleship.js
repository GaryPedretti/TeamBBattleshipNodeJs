const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

class Battleship {

   
printBoard(boardType, title) {
    console.log(cliColor.cyan(`\n=== ${title} ===`));

    // Column headers
    let header = "   ";
    for (let c = 0; c < this.cols; c++) {
        header += String.fromCharCode(65 + c) + " ";
    }
    console.log(cliColor.yellow(header));

    // Each row
    for (let r = 1; r <= this.rows; r++) {
        let rowString = (r < 10 ? " " + r : r) + " ";
        for (let c = 1; c <= this.cols; c++) {
            const letter = String.fromCharCode(64 + c);
            const pos = new position(letters.get(letter), r);
            let symbol = "·"; // empty sea

            // --- Safe helper to compare positions, even if some are strings ---
            const samePos = (p) => {
                if (!p) return false;
                if (typeof p.equals === "function") return p.equals(pos);
                if (typeof p === "string") return p.toUpperCase() === pos.toString().toUpperCase();
                if (p.column && p.row) return p.column === pos.column && p.row === pos.row;
                return false;
            };

            // Player's ships
            if (boardType === "Player" && this.myFleet?.some(ship => ship.positions?.some(samePos))) {
                symbol = cliColor.blue("■");
            }

            // Enemy ships (stay hidden unless hit)
            if (boardType === "Enemy" && this.enemyFleet?.some(ship => ship.positions?.some(samePos))) {
                symbol = "·";
            }

            // Show hits & misses
            if (this.hits?.some(samePos)) {
                symbol = cliColor.red("X");
            } else if (this.misses?.some(samePos)) {
                symbol = cliColor.white("o");
            }

            rowString += symbol + " ";
        }
        console.log(rowString);
    }
    console.log();
}


    start() {
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");   

        console.log("Starting...");
        telemetryWorker.postMessage({eventName: 'ApplicationStarted', properties:  {Technology: 'Node.js'}});

        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");

        console.log("Starting...");
        telemetryWorker.postMessage({eventName: 'ApplicationStarted', properties: {Technology: 'Node.js'}});

        this.setBoardSize();
        this.InitializeGame();
        this.StartGame();
    }

    StartGame() {
        console.clear();
        console.log("                  __");
        console.log("                 /  \\");
        console.log("           .-.  |    |");
        console.log("   *    _.-'  \\  \\__/");
        console.log("    \\.-'       \\");
        console.log("   /          _/");
        console.log("  |      _  /");
        console.log("  |     /_\\'");
        console.log("   \\    \\_/");
        console.log("    \"\"\"\"");

        do {
            console.log();
             this.printBoard("Player", "Your Fleet");
            this.printBoard("Enemy", "Enemy Waters (hidden)");
            console.log("Player, it's your turn");
            console.log(cliColor.green("Type exit to quit the game, or your coordinates for your shot"));
            var answer = readline.question();
            if (answer.toLowerCase() === "exit") {
                telemetryWorker.postMessage({eventName: 'ApplicationEnded', properties: {}});
                console.log("Thanks for playing! Goodbye.");
                process.exit(0);
            }
            var position = Battleship.ParsePosition(answer);
            var isHit = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: isHit}});

            if (isHit) {
                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            }

            console.log(cliColor.red(isHit ? "Yeah ! Nice hit !" : "Miss"));
        
            

            var computerPos = this.GetRandomPosition();
            var isHit = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: isHit}});

            console.log();
            console.log(cliColor.red(`Computer shot in ${computerPos.column}${computerPos.row} and ` + (isHit ? `has hit your ship !` : `miss`)));
            if (isHit) {
                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            }
        }
        while (true);
    }


    setBoardSize() {
        
    console.log();
    console.log("Configure your game board:");

    const MAX_DIM = 26;
    const MIN_DIM = 5;
    const DEFAULT = 8;

    let rows, cols;

    while (true) {


        // Ask user for number of rows and columns (defaults: 8x8)
        rows = parseInt(readline.question("Enter number of rows (default 8): ") || "8", 10);
        cols = parseInt(readline.question("Enter number of columns (default 8): ") || "8", 10);

        if (Number.isNaN(rows) || Number.isNaN(cols)) {
            console.log(cliColor.yellow("Rows and columns must be numbers. Please try again."));
            continue;
        }

        if (rows < 1 || cols < 1) {
            console.log(cliColor.yellow("Rows and columns must be at least 1. Please try again."));
            continue;
        }

        if (rows > MAX_DIM || cols > MAX_DIM) {
            console.log(cliColor.yellow(`Rows and columns cannot exceed ${MAX_DIM}. Please enter values between 1 and ${MAX_DIM}.`));
            continue;
        }

        // Validate: minimum 17 total spaces and at least one dimension must be 5 or more
        const totalSpaces = rows * cols;
        if (totalSpaces < 17 || (rows < 5 && cols < 5)) {
            console.log(cliColor.yellow(`Board must have at least 17 total grid spaces and one dimension must be at least 5. Please try again.`));
            continue;
        }
 

        // valid values
        break;
    }

    this.rows = rows;
    this.cols = cols;

    console.log(cliColor.green(`Board size set to ${cols} columns (A-${String.fromCharCode(64 + cols)}) and ${rows} rows.`));
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    GetRandomPosition() {
    const rndColumn = Math.floor(Math.random() * this.cols);
    const rndRow = Math.floor(Math.random() * this.rows);

    const letter = letters.get(rndColumn + 1);
    const number = rndRow + 1;

    return new position(letter, number);
    }

    InitializeGame() {
        this.hits = [];
        this.misses = [];
        this.InitializeMyFleet();
        this.InitializeEnemyFleet();
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log(`Please position your fleet (Game board size is from A to ${String.fromCharCode(64 + this.cols)} and 1 to ${this.rows}) :`);

        this.myFleet.forEach(function (ship) {
            console.log();
            console.log(cliColor.cyan(`Please enter the positions for the ${ship.name} (size: ${ship.size})`));
            for (var i = 1; i < ship.size + 1; i++) {
                    console.log(cliColor.cyan(`Enter position ${i} of ${ship.size} (i.e A3):`));
                    const position = readline.question();
                    telemetryWorker.postMessage({eventName: 'Player_PlaceShipPosition', properties:  {Position: position, Ship: ship.name, PositionInShip: i}});
                    ship.addPosition(Battleship.ParsePosition(position));
            }
        })
    }

    InitializeEnemyFleet() {
        this.enemyFleet = gameController.InitializeShips();

        this.enemyFleet[0].addPosition(new position(letters.B, 4));
        this.enemyFleet[0].addPosition(new position(letters.B, 5));
        this.enemyFleet[0].addPosition(new position(letters.B, 6));
        this.enemyFleet[0].addPosition(new position(letters.B, 7));
        this.enemyFleet[0].addPosition(new position(letters.B, 8));

        this.enemyFleet[1].addPosition(new position(letters.E, 6));
        this.enemyFleet[1].addPosition(new position(letters.E, 7));
        this.enemyFleet[1].addPosition(new position(letters.E, 8));
        this.enemyFleet[1].addPosition(new position(letters.E, 9));

        this.enemyFleet[2].addPosition(new position(letters.A, 3));
        this.enemyFleet[2].addPosition(new position(letters.B, 3));
        this.enemyFleet[2].addPosition(new position(letters.C, 3));

        this.enemyFleet[3].addPosition(new position(letters.F, 8));
        this.enemyFleet[3].addPosition(new position(letters.G, 8));
        this.enemyFleet[3].addPosition(new position(letters.H, 8));

        this.enemyFleet[4].addPosition(new position(letters.C, 5));
        this.enemyFleet[4].addPosition(new position(letters.C, 6));
    }
}

module.exports = Battleship;