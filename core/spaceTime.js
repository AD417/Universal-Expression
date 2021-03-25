function changeTime(diff) {
    player.dTime = D(2).pow(player.timeBoosts);
    let dt = player.dTime
    if (player.upgrades.space[0]) dt = dt.times(player.space.add(10).log(10))
    player.time = player.time.add(dt.times(diff / 1000));


    if (player.upgrades.space[2]) {
        player.timeCost = D(10).times(Decimal.pow(2.5, player.timeBoosts)).div(
            1 //Decimal.min(Decimal.pow(9/8, player.spaceGens[0].add(player.spaceGens[1]).add(player.spaceGens[2])), 1e50) //This is broken.
        );
    }
    getEl("time").innerHTML = display(player.time);
    getEl("timePerSecond").innerHTML = display(dt); 
    getEl("timeCost").innerHTML = display(player.timeCost); 
}

function changeSpace(diff) { 
    if (!player.upgrades.time[0]) return;
    let Sdiff;
    if (player.upgrades.spaceTime[0]) {
        Sdiff = player.dTime.pow(0.4);
    } else {
        Sdiff = D(1)
    }
    tmp.dSpace = player.spaceGens[0].times(Sdiff);
    if (1 === 1) { // Todo: add an upgrade or something.
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[1].times(Sdiff).times(10).times(player.upgrades.space[1] ? player.time.log(8) : 1));
        tmp.dSpace = tmp.dSpace.add(player.spaceGens[2].times(Sdiff).times(1000));
    } else {
        player.spaceGens[0] = player.spaceGens[0].add(player.spaceGens[1].times(Sdiff.div(10000)));  //10s per.
        player.spaceGens[1] = player.spaceGens[1].add(player.spaceGens[2].times(Sdiff.div(100000))); //100s per. 
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
    if (!pastStage(2)) return;
    let dSpaceTime = player.dTime.times(tmp.dSpace).sqrt()
    player.spaceTime = player.spaceTime.add(dSpaceTime.div(1000 / diff))

    getEl("spaceTime").innerHTML = display(player.spaceTime.minus(player.STD));
    getEl("spaceTimePerSecond").innerHTML = display(dSpaceTime);
}

//Buttons and Upgrades: 

function upgTime() {
    if (player.time.lt(player.timeCost)) return;
    player.timeBoosts++;
    player.dTime = D(2).pow(player.timeBoosts);
    player.timeCost = D(10).times(Decimal.pow(2.5, player.timeBoosts));
}

function buySpaceDim(dim) {
    if (player.space.lt(player.spaceGenCost[dim])) return
    player.space = player.space.minus(player.spaceGenCost[dim])
    player.spaceGens[dim] = player.spaceGens[dim].add(1)
    player.spaceGenCost[dim] = player.spaceGenCost[dim].times(1 + (0.2 * dim + 0.2))
}

const STCOSTS = { //yeah, this isnt constant, but I dunno a better implementation right now. 
    time: [100, 1e5, 1e9],
    space: [100, 1e4, Infinity],
    spaceTime: [1e3, Infinity, 1e8],
}

function getTimeUpgrade(num) {
    upgs = player.upgrades.time
    costs = STCOSTS.time
    if (upgs[num] || player.time.lt(costs[num])) return
    upgs[num] = true
    updateGameStage()
}

function getSpaceUpgrade(num) {
    upgs = player.upgrades.space
    costs = STCOSTS.space
    if (upgs[num] || player.space.lt(costs[num])) return
    upgs[num] = true
    player.space.sub(costs[num])
}

function getSTUpgrade(num) {
    upgs = player.upgrades.spaceTime
    costs = STCOSTS.spaceTime
    if (upgs[num] || player.spaceTime.minus(player.STD).lt(costs[num])) return
    upgs[num] = true
    player.STD.add(costs[num])
}
/* function getUpgrade(type, num) {
    let cur = ["time", "space", "spaceTime"][type];
    if (player[cur].lt(STCOSTS[cur][num]) || player.upgrades[cur][num]) return;
    switch (type) {
        case 2: 
            player.STD = player.STD.add(STCOSTS[cur][num]) //This may be a problem. 
            break
        case 1: 
            player.space = player.space.sub(STCOSTS[cur][num]);
            break;
        case 0: 
        default:
            break;
    }
    player.upgrades[cur][num] = true;
}  Absolutely cursed previous function stuff */