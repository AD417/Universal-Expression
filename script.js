//General Data
let player, tmp;
let D = x => new Decimal(x); //I'm lazy. 
let getEl = x => document.getElementById(x);
let basePlayer = { 
    firstTick: Date.now(),
    lastTick: Date.now(),
    version: 0.001,
    //stage: 0,

    upgrades: {
        time: [false, false, false],
        spaceTime: [false, false, false],
        space: [false, false, false]
    },

    time: D(0),
    dTime: D(1),
    timeBoosts: 0,
    timeCost: D(10),

    spaceTime: D(0),
    dSpaceTime: D(0),
    STD: D(0), //SpaceTime Difference. When upgrades deduct from SpaceTime. 

    space: D(0),
    totalSpace: D(0),
    spaceGens: [D(1), D(0), D(0),],
    spaceGenCost: [D(10), D(1000), D(1e6),],

    matter: D(0),

    testVar: "Anthios made this you forkin idiots"
};

function tab(tabID) {
    let i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    getEl([null, "Main", "Matter", "Options", "Statistics", "DevLog"][tabID]).style.display = "block";
    setUpCanvas(tabID)
}

function load() {
    tab(1)
    let parse = localStorage.getItem("save");
    try {
        player = JSON.parse(atob(parse));
        player = check(player, basePlayer);
    } catch (e) {
        newGame();
    }
    player = decimalify(player); //Give everything its code-mandated Break
    setup() //load in everything that is not updated on every tick. 
    setupTemp();
    setInterval(loop, 50);
    setInterval(save, 10000);
}

function setup() {
    updateGameStage()
    getEl("time").innerHTML = 0
    getEl("space").innerHTML = 0
    getEl("spaceTime").innerHTML = 0
    for (let i; i < 3; i++) {
        getEl("spaceDim"+i).innerHTML = 0
    }
}

function check(val, base) {
    if (base instanceof Object && !(base instanceof Decimal)) {
        if (val === undefined) return base;
        let i;
        for (i in base) {
            val[i] = check(val[i], base[i]);
        }
        return val;
    } else {
        if (val === undefined) return base;
        return val;
    }
}

function decimalify(val) {
    if (val instanceof Object && !(val instanceof Decimal)) {
        let i;
        for (i in val) {
            val[i] = decimalify(val[i]);
        }
        return val;
    } else if (typeof(val) === "string" && !isNaN(parseInt(val))) {
        return D(val);
    }
    return val;
}

function newGame() {
    basePlayer.lastTick = Date.now();
    basePlayer.firstTick = Date.now()
    player = decimalify(JSON.parse(JSON.stringify(basePlayer)));
    setup()
}

function setupTemp() {
    tmp = { // Do we need this? None of this is actually needed in a tmp variable. 
        dSpace: D(0),

        spaceTimeLastTick: D(0),
        dSpaceTime: D(0),
    }
}

function save() {
    if (canSave()) {
        localStorage.setItem("save", btoa(JSON.stringify(player)));
    }
    //console.log("Game saved.")
}

function canSave() {
    return true; //ToDo... not now, but eh.
}

function reset() {
    if (!confirm("are you suuuuuuuuurrrreeee????")) return;
    newGame();
}

//Game Loop stuff

function loop(diff) {
    if (typeof(diff) === "undefined") {
        diff = Date.now() - player.lastTick;
        player.lastTick += diff;
    }
    //SpaceTime
    changeTime(diff);
    changeSpace(diff);
    changeSpaceTime(diff);
    updateUpgs();

    //General stuff
    updateStatistics();
    color();
    updateAnimationData();
}

function updateStatistics() {
    getEl("statTime").innerHTML = display(player.time);
    getEl("statSpace").innerHTML = display(player.totalSpace);
    getEl("playtime").innerHTML = display(Math.floor((player.lastTick - player.firstTick) / 1000));
}

function pastStage(stage) {
    stage--
    const STAGESREQ = [ //This will almost certainly fail when we get more advanced systems of stage development.
        player.upgrades.time[0], //First time upgrade: unlock space and space stuff
        player.upgrades.time[1], //Second time upgrade: unlock Spacetime
        player.upgrades.time[2], //Third time upgrade: unlock Matter
    ]
    let ret = 0
    for (let i in STAGESREQ) {
        if (STAGESREQ[i]) ret = parseInt(i);
    }
    if (stage === undefined) return ret;
    else return (ret >= stage);

}

function updateGameStage() {
    const stageTrig = [
        player.upgrades.time[0],
        player.upgrades.time[1],
        player.upgrades.time[2],
    ]
    const stageGo = [
        () => {
            getEl("spaceTile").style.display = "inline-block";
            el = getEl("spaceTimeTile").style
            el.display = "inline-block"
            el.visibility = "hidden"
        },
        () => {
            getEl("spaceTimeTile").style.visibility = "visible"
        },
        () => {
            getEl("matterTab").style.display = "inline-block"
        }
    ]
    const stageDont = [
        () => {
            getEl("spaceTile").style.display = "none";
            getEl("spaceTimeTile").style.display = "none"
        },
        () => {
            getEl("spaceTimeTile").style.visibility = "hidden"
        },
        () => {
            getEl("matterTab").style.display = "none"
        }
    ]
    for (i in stageTrig) {
        if (stageTrig[i]) {
            stageGo[i]()
        } else {
            stageDont[i]()
        }
    }
}
//looks and color.
function updateUpgs() {
    let cur;
    for (cur in STCOSTS) {
        let len = player.upgrades[cur].length;
        for (let i in STCOSTS[cur]) { //we are assuming that STCOSTS.length === player.upgrades[cur].length. it should be. 
            btn = getEl(cur + i);
            if (player.upgrades[cur][i]) {
                btn.className = `upgrade ${cur} upgBought`;
            } else if (player[cur].gte(STCOSTS[cur][i])) {
                btn.className = `upgrade ${cur} upgBuyable`;
            } else {
                btn.className = `upgrade ${cur}`;
            }
        }
    }
}