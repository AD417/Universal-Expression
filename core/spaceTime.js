function changeTime(diff) {
    let dt = player.dTime
    if (player.upgrades.space[0]) dt = dt.times(player.space.add(10).log(10))
    player.time = player.time.add(dt.times(diff / 1000));
    getEl("time").innerHTML = display(player.time);
    getEl("timePerSecond").innerHTML = display(dt); 
    getEl("timeCost").innerHTML = display(player.timeCost); //Does this need to be updated every frame? Eventually, probably.
}

function changeSpace(diff) { 
    if (!player.upgrades.time[0]) return;
    let Sdiff = D(diff).times(player.dTime).div(8);
    tmp.dSpace = player.spaceGens[0].times(Sdiff.div(1000));
    if (1 === 1) { // Todo: add an upgrade or something.
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[1].times(Sdiff.div(1000)).times(10).times(player.upgrades.space[1] ? player.time.log(10) : 1));
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[2].times(Sdiff.div(1000)).times(100));
    } else {
        player.spaceGens[0] = player.spaceGens[0].add(player.spaceGens[1].times(Sdiff.div(10000)));
        player.spaceGens[1] = player.spaceGens[1].add(player.spaceGens[2].times(Sdiff.div(100000)));
    }
    player.space = player.space.add(tmp.dSpace);
    player.totalSpace = player.totalSpace.add(tmp.dSpace);
    getEl("space").innerHTML = display(player.space);
    getEl("spacePerSecond").innerHTML = display(tmp.dSpace.times(1000 / diff));
    for (let i = 0; i <= 2; i++) {  
        getEl("spaceDim" + i).innerHTML = display(player.spaceGens[i].floor());
        getEl("spaceCost" + i).innerHTML = display(player.spaceGenCost[i]);
    }
}

function changeSpaceTime(diff) { //TODO: make this function better. 
    if (!player.upgrades.time[1]) return;
    let lastTick = player.spaceTime;
    player.spaceTime = player.space.times(player.time.minus(player.STTimePenalty)).minus(player.STD).max(0)//.floor();
    tmp.dSpaceTime = player.spaceTime.minus(lastTick);

    getEl("spaceTime").innerHTML = display(player.spaceTime);
    getEl("spaceTimePerSecond").innerHTML = display(tmp.dSpaceTime.times(1000 / diff));
}

//Buttons and Upgrades: 

function upgTime() {
    if (player.time.lt(player.timeCost)) return;
    player.timeBoosts++;
    player.dTime = D(2).pow(player.timeBoosts);
    player.timeCost = D(10).pow(D(1.25).pow(player.timeBoosts));
}

function buySpaceDim(dim) {
    if (player.space.lt(player.spaceGenCost[dim])) return
    player.space = player.space.minus(player.spaceGenCost[dim])
    player.spaceGens[dim] = player.spaceGens[dim].add(1)
    player.spaceGenCost[dim] = player.spaceGenCost[dim].times(1.4 * (dim+1))
}

const STCOSTS = [
    [100, 1e5, 1e20],
    [100, 1e4, 1e12],
    [10000, 1e20, 1e50],
]

function getUpgrade(type, num) {
    let currency = ["time", "space", "spaceTime"][type];
    if (player[currency].lt(STCOSTS[type][num]) || player.upgrades[currency][num]) return;
    switch (type) {
        case 2: 
            player.STD = player.STD.add(STCOSTS[type][num]) //This may be a problem. 
            break
        case 1: 
            player.space = player.space.sub(STCOSTS[type][num]);
            break;
        case 0: 
        default:
            break;
    }
    player.upgrades[currency][num] = true;
    if (currency == "time" && num == 2) player.STTimePenalty = player.time
}