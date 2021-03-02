let player;

function load() {
    let parse = localStorage.getItem("save")
    if (parse !== null) {
        player = JSON.parse(atob(parse))
    } else {
        newGame()
    }
    tab(1)
    setInterval(() => {loop()}, 50)
    setInterval(() => {save()}, 10000)
}

function newGame() {
    player = {
        lastTick: Date.now(),
        time: 0,
        dTime: 1,
        spaceTime: 0,
        STD: 0,
        space: 0,
        spaceGens: [null, 1, 0, 0,]

    }
}

function loop(diff) {
    if (typeof(diff) === "undefined") {
        diff = Date.now() - player.lastTick
        player.lastTick += diff
    }
    changeTime(diff)
    changeSpace(diff)
    changeSpaceTime(diff)
}

function save() {
    if (canSave()) {
        localStorage.setItem("save", btoa(JSON.stringify(player)))
    }
}

function canSave() {
    return true //ToDo... not now, but eh.
}

function reset() {
    if (!confirm("are you suuuuuuuuurrrreeee????")) return
    newGame()
}

function tab(tabID) {
    console.log(tabID)
    let i, tabcontent, tablinks;
  
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById([null, "Main", "Options", "Statistics"][tabID]).style.display = "block";
    event.currentTarget.className += " active";
}

function changeTime(diff) {
    player.time += player.dTime * diff / 1000
    document.getElementById("time").innerHTML = Math.floor(player.time)
}

function changeSpace(diff) {
    player.space += player.spaceGens[1] * diff / 1000
    for (let i = 1; i <= 2; i++) {
        player.spaceGens[i] += player.spaceGens[i+1] * diff / 1000
    }
    document.getElementById("space").innerHTML = Math.floor(player.space)
}

function changeSpaceTime(diff) {
    player.spaceTime = player.space * player.time - player.STD
    document.getElementById("spaceTime").innerHTML = Math.floor(player.spaceTime)
}