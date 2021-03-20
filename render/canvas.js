let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let render = {
    width: window.innerWidth, 
    height: window.innerHeight, 

    lines: [],
};
render.max = Math.max(render.width, render.height);

function setUpCanvas() {
    ctx.fillStyle = "black";
    for (let i=0, j=1; j < render.max; i++) {
        render.lines[i] = j
        j *= 1.25
    }
}

function draw() {
    render.width = window.innerWidth
    render.height = window.innerHeight
    c.setAttribute("width", render.width)
    c.setAttribute("height", render.height)
    let i;
    for (i in render.lines) {
        render.lines[i] *= (1.2 ** 0.008)
        if (render.lines[i] > render.max / 2 + 10) {
            render.lines.pop()
            render.lines.unshift(render.lines[0] / 1.25)
        }
    }
    ctx.fillRect(0,0,c.width,c.height);
    ctx.lineWidth = "1";
    for (i in render.lines) {
        let cf = (player.spaceTime.minus(player.STD).min(1e50).max(1).log(10) / 50) //will fix in the future, this will not do at all. 
        //console.log(cf)
        ctx.strokeStyle = `rgb(${Math.min(render.lines[i], 127 * cf)},${Math.min(render.lines[i], 127 * cf)},${Math.min(render.lines[i], 127 * cf)})`;
        ctx.beginPath();
        ctx.moveTo(0, render.lines[i] + c.height/2);
        ctx.lineTo(c.width, render.lines[i] + c.height/2);
        ctx.moveTo(0, -render.lines[i] + c.height/2);
        ctx.lineTo(c.width, -render.lines[i] + c.height/2);
        ctx.moveTo(render.lines[i] + c.width/2, 0);
        ctx.lineTo(render.lines[i] + c.width/2, c.height);
        ctx.moveTo(-render.lines[i] + c.width/2, 0);
        ctx.lineTo(-render.lines[i] + c.width/2, c.height);
        ctx.stroke();
    }
}
setInterval(draw, 20);