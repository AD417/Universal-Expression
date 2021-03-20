function changeTime(diff) {
    player.dTime = D(2).pow(player.timeBoosts);
    let dt = player.dTime
    if (player.upgrades.space[0]) dt = dt.times(player.space.add(10).log(10))
    player.time = player.time.add(dt.times(diff / 1000));


    if (player.upgrades.space[2]) {
        player.timeCost = D(10).times(Decimal.pow(2.5, player.timeBoosts)).div(
            1 //Decimal.min(Decimal.pow(9/8, player.spaceGens[0].add(player.spaceGens[1]).add(player.spaceGens[2])), 1e50) //This will break when dimensions start compounding. 
        );
    }
    getEl("time").innerHTML = display(player.time);
    getEl("timePerSecond").innerHTML = display(dt); 
    getEl("timeCost").innerHTML = display(player.timeCost); //Does this need to be updated every frame? Eventually, probably.
}

function changeSpace(diff) { 
    if (!player.upgrades.time[0]) return;
    let Sdiff;
    if (player.upgrades.spaceTime[0]) {
        Sdiff = player.dTime.pow(0.6);
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
    if (!player.upgrades.time[1]) return;
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
    player.spaceGenCost[dim] = player.spaceGenCost[dim].times(1.4 * (dim+1))
}

const STCOSTS = [
    [100, 1e5, 1e9],
    [100, 1e4, 3e6],
    [1e3, 1e6, 1e8],
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
    if (player.upgrades.time[2]) window.alert("yay you did it! thats all for now. Check back later when we add more content.")
}