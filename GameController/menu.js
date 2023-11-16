function displayMenu (allShips1, allShips2){
    console.log("Your ships \t\t\t\t\t Opponent ships")
    console.log("__________ \t\t\t\t\t ______________")
    for(var i = 0; i < allShips1.length; i++){
        var ship1 = allShips1[i].name
        var ship2 = allShips2[i].name
        if(ship1.length > 15){
            console.log(`${ship1} \t\t\t\t ${ship2}`)
        }
        else{
            console.log(`${ship1} \t\t\t\t\t ${ship2}`)
        }
    }
    console.log()
}

module.exports = displayMenu;