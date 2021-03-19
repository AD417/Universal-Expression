function changeTime(diff) {
    let dt = player.dTime
    if (player.upgrades.space[0]) dt = dt.times(player.space.add(10).log(10))
    player.time = player.time.add(dt.times(diff / 1000));

    if (player.upgrades.space[2]) {
        player.timeCost = D(10).pow(D(1.25).pow(player.timeBoosts)).div(
            Decimal.min(Decimal.pow(1.1, player.spaceGens[0].add(player.spaceGens[1]).add(player.spaceGens[2])), 1e50) //This will break when dimensions start compounding. 
        );
    }
    getEl("time").innerHTML = display(player.time);
    getEl("timePerSecond").innerHTML = display(dt); 
    getEl("timeCost").innerHTML = display(player.timeCost); //Does this need to be updated every frame? Eventually, probably.
}

function changeSpace(diff) { 
    if (!player.upgrades.time[0]) return;
    let Sdiff = player.dTime.div(8);
    tmp.dSpace = player.spaceGens[0].times(Sdiff);
    if (1 === 1) { // Todo: add an upgrade or something.
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[1].times(Sdiff).times(10).times(player.upgrades.space[1] ? player.time.log(10) : 1));
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[2].times(Sdiff).times(100));
    } else {
        player.spaceGens[0] = player.spaceGens[0].add(player.spaceGens[1].times(Sdiff.div(10000)));
        player.spaceGens[1] = player.spaceGens[1].add(player.spaceGens[2].times(Sdiff.div(100000)));
    }
    player.space = player.space.add(tmp.dSpace.times(diff / 1000));
    player.totalSpace = player.totalSpace.add(tmp.dSpace.times(diff / 1000));
    getEl("space").innerHTML = display(player.space);
    getEl("spacePerSecond").innerHTML = display(tmp.dSpace);
    for (let i = 0; i <= 2; i++) {  
        getEl("spaceDim" + i).innerHTML = display(player.spaceGens[i].floor());
        getEl("spaceCost" + i).innerHTML = display(player.spaceGenCost[i]);
    }
}

function changeSpaceTime(diff) { //TODO: make this function better. 
    if (!player.upgrades.time[1]) return;
    let dSpaceTime = player.dTime.times(tmp.dSpace).sqrt()
    player.spaceTime = player.spaceTime.add(dSpaceTime.div(1000 / diff))

    getEl("spaceTime").innerHTML = display(player.spaceTime);
    getEl("spaceTimePerSecond").innerHTML = display(dSpaceTime);
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
    [100, 1e4, 1e8],
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