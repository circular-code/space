var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

function randomNumBetween(max, min) {
    if (typeof max === 'undefined'){
        console.error('max undefined');
        return false;
    }
    if (typeof min === 'undefined'){
        min = 0;
    }
    return Math.floor(Math.random()*(max-min)+min);
}

//TODO: save map state and player position

// function keyDownHandler(e) {
// }

// function keyUpHandler(e) {
// }

// function mouseMoveHandler(e) {
// }

function mouseClickHandler(e) {
    mouseX = e.clientX + viewport.x;
    mouseY = e.clientY + viewport.y;
}

function distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function draw() {

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0 + viewport.x, 0 + viewport.y, canvas.width + viewport.x, canvas.height + viewport.y);
    ctx.rect(0, 0, canvas.width, canvas.height);
    // ctx.fillStyle = "#01020E";
    ctx.fillStyle = "#090E26";
    ctx.fill();

    ship.move();
    ship.checkActiveChunk();

    viewport.focus();

    ctx.translate(-viewport.x, -viewport.y);

    map.draw();
    ship.draw();
    ship.checkCollision();
    ship.refuelEnergy();

    requestAnimationFrame(draw);
}
var size = 1000;
var radius = 3;
var mouseX = size/2 - radius/2;
var mouseY = size/2 - radius/2;
var ship = new Ship({radius: radius, x: mouseX, y: mouseY, speed: 1, energy: 2500});
var map = new Map(size);
var viewport = new Viewport();
map.addChunk(0,0);
draw();
