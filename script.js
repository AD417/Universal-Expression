//General Data
let player;
function D(x) { return new Decimal(x)} //I'm lazy. 

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
  
    document.getElementById([null, "Main", "Matter", "Options", "Statistics"][tabID]).style.display = "block";
}

function load() {
    tab(1)
    let parse = localStorage.getItem("save")
    if (parse !== null) {
        player = JSON.parse(atob(parse))
        decimalify() //Give everything its code-mandated Break
    } else {
        newGame()
    }
    //setupGame() //load in everything that is not updated on every tick. 
    setInterval(() => {loop()}, 50)
    setInterval(() => {save()}, 10000)
}

function decimalify() {
    for (value in player) {
        if (typeof(player[value]) == "object") {
            for (index in player[value]) {
                player[value][index] = D(player[value][index])
            }
        } else if (typeof(player[value]) == "string") {
            player[value] = D(player[value])
        }
    }
}

function newGame() {
    player = {
        lastTick: Date.now(),
        version: 0.001,

        time: D(0),
        dTime: D(1),
        timeBoosts: 0,
        timeCost: D(10),

        spaceTime: D(0),
        dSpaceTime: D(0),
        STD: D(0), //SpaceTime Difference. When upgrades deduct from SpaceTime. 

        space: D(0),
        spaceGens: [D(1), D(0), D(0),],
        spaceGenCost: [D(10), D(1000), D(1e8)],

        testVal: D("1e400")
    }
}

function save() {
    if (canSave()) {
        localStorage.setItem("save", btoa(JSON.stringify(player)))
    }
    //console.log("Game saved.")
}

function canSave() {
    return true //ToDo... not now, but eh.
}

function reset() {
    if (!confirm("are you suuuuuuuuurrrreeee????")) return
    newGame()
}

//Game Loop stuff

function loop(diff) {
    if (typeof(diff) === "undefined") {
        diff = Date.now() - player.lastTick
        player.lastTick += diff
    }
    changeTime(diff)
    changeSpace(diff)
    changeSpaceTime(diff)
}
