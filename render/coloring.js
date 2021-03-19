const COLORMAX = [10, 10, 10]; //time, space, matter. They might all be 10...?
const CHROMOS = [ //the maximum possible color values for certain UI elements.
    [270, 50, 60, 270, 100, 20],
    [200, 100, 50, 240, 100, 20],
]; //Time, Space, Matter. SpaceTime = Space & Time. 
function color() {
    let cur, potency, arr, vars = document.querySelector(':root');
    for (let i=0; i<2; i++) {
        cur = ["time","space"][i];
        potency = Math.max(Math.min(player[cur].add(1).log(10) / COLORMAX[i], 1),0);
        arr = CHROMOS[i]
        vars.style.setProperty(`--${cur}`, `hsl(${arr[0]},${Math.floor(arr[1] * potency)}%,${arr[2]}%)`);
        vars.style.setProperty(`--${cur}Back`, `hsl(${arr[3]},${Math.floor(arr[4] * potency)}%,${arr[5]}%)`);
    }
}

function updateAnimationData() {
    return false //we dont need it yet.
}