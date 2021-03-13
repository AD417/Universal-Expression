function changeTime(diff) {
    player.time = player.time.add(player.dTime.times(diff / 1000))
    getEl("time").innerHTML = display(player.time)
    getEl("timePerSecond").innerHTML = display(player.dTime) //Does this need to be updated every frame? Eventually, probably.
    getEl("timeCost").innerHTML = display(player.timeCost)
}

function changeSpace(diff) { 
    let Sdiff = D(diff).times(player.dTime)
    tmp.dSpace = player.spaceGens[0].times(Sdiff.div(1000))
    if (1 === 1) { // Todo: add an upgrade or something.
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[1].times(Sdiff.div(1000)))
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[2].times(Sdiff.div(1000)))
    } else {
        player.spaceGens[0] = player.spaceGens[0].add(player.spaceGens[1].times(Sdiff.div(10000)))
        player.spaceGens[1] = player.spaceGens[1].add(player.spaceGens[2].times(Sdiff.div(100000)))
    }
    player.space = player.space.add(tmp.dSpace)
    player.totalSpace = player.totalSpace.add(tmp.dSpace)
    getEl("space").innerHTML = display(player.space)
    getEl("spacePerSecond").innerHTML = display(tmp.dSpace.times(1000 / diff))
    for (let i = 0; i <= 2; i++) {  
        getEl("spaceDim" + i).innerHTML = display(player.spaceGens[i].floor())
        getEl("spaceCost" + i).innerHTML = display(player.spaceGenCost[i])
    }
}

function changeSpaceTime(diff) {
    let lastTick = player.spaceTime
    player.spaceTime = player.space.times(player.time).minus(player.STD).max(0)//.floor()
    tmp.dSpaceTime = player.spaceTime.minus(lastTick)

    getEl("spaceTime").innerHTML = display(player.spaceTime)
    getEl("spaceTimePerSecond").innerHTML = display(tmp.dSpaceTime.times(1000 / diff))
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
    player.spaceGenCost[dim] = player.spaceGenCost[dim].times(1.5 + dim)
}