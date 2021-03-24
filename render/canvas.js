let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let render = {
    width: window.innerWidth, 
    height: window.innerHeight, 

    data: [],
    mode: 0,
};
render.max = Math.max(render.width, render.height);

function setUpCanvas(mode) {
    ctx.fillStyle = "black";
    render.data = []
    if (mode === 1) {
        for (let i=0, j=1; j < render.max; i++) {
            render.data[i] = j
            j *= 1.25
        }
        render.mode = 1
    } else render.mode = 0
}

function draw() {
    render.width = window.innerWidth
    render.height = window.innerHeight
    c.setAttribute("width", render.width)
    c.setAttribute("height", render.height)
    ctx.fillRect(0,0,c.width,c.height);
    let i;
    if (render.mode === 1) {
        for (i in render.data) {
            render.data[i] *= (1.2 ** 0.008)
            if (render.data[i] > render.max / 2 + 10) {
                render.data.pop()
                render.data.unshift(render.data[0] / 1.25)
            }
        }
        ctx.lineWidth = "1";
        for (i in render.data) {
            let cf = (player.spaceTime.minus(player.STD).min(1e50).max(1).log(10) / 50) //will fix in the future, this will not do at all. 
            //console.log(cf)
            ctx.strokeStyle = `rgb(${Math.min(render.data[i], 127 * cf)},${Math.min(render.data[i], 127 * cf)},${Math.min(render.data[i], 127 * cf)})`;
            ctx.beginPath();
            ctx.moveTo(0, render.data[i] + c.height/2);
            ctx.lineTo(c.width, render.data[i] + c.height/2);
            ctx.moveTo(0, -render.data[i] + c.height/2);
            ctx.lineTo(c.width, -render.data[i] + c.height/2);
            ctx.moveTo(render.data[i] + c.width/2, 0);
            ctx.lineTo(render.data[i] + c.width/2, c.height);
            ctx.moveTo(-render.data[i] + c.width/2, 0);
            ctx.lineTo(-render.data[i] + c.width/2, c.height);
            ctx.stroke();
        }
    }
}
setInterval(draw, 20);