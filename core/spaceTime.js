function changeTime(diff) {
    player.time = player.time.add(player.dTime.times(diff / 1000))
    document.getElementById("time").innerHTML = display(player.time)
    document.getElementById("timePerSecond").innerHTML = display(player.dTime) //Does this need to be updated every frame? Eventually, probably.
    document.getElementById("timeCost").innerHTML = display(player.timeCost)
}

function changeSpace(diff) { //Change this garbage
    diff = D(diff).times(player.dTime)
    let dSpace = D(0)
    player.space = player.space.add(player.spaceGens[0].times(diff / 1000))
    if (1 === 1) {
        for (let i = 0; i <= 1; i++) { //Why dafuk do I use a for loop here? 
            player.space = player.space.add(player.spaceGens[i+1].times(diff / 1000))
        }
    } else {
        for (let i = 0; i <= 1; i++) {
            player.spaceGens[i] = player.spaceGens[i].add(player.spaceGens[i+1].times(diff / 1000 * 10 ** i))
        }
    }
    document.getElementById("space").innerHTML = display(player.space)
    for (i = 0; i <= 2; i++) {
        document.getElementById("spaceDim" + i).innerHTML = display(player.spaceGens[i].floor())
        document.getElementById("spaceCost" + i).innerHTML = display(player.spaceGenCost[i])
    }
}

function changeSpaceTime(diff) {
    player.spaceTime = player.space.times(player.time).minus(player.STD).max(0).floor()
    document.getElementById("spaceTime").innerHTML = display(player.spaceTime)
}

//Buttons and Upgrades: 

function upgTime() {
    if (player.time.lt(player.timeCost)) return
    player.timeBoosts++
    player.dTime = D(2).pow(player.timeBoosts)
    player.timeCost = D(10).pow(D(1.5).pow(player.timeBoosts))
}

function buySpaceDim(dim) {
    if (player.space.lt(player.spaceGenCost[dim])) return
    player.space = player.space.minus(player.spaceGenCost[dim])
    player.spaceGens[dim] = player.spaceGens[dim].add(1)
    player.spaceGenCost[dim] = player.spaceGenCost[dim].times(1.5)
}