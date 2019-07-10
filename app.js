var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouseX = 0;
var mouseY = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
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

function keyDownHandler(e) {
}

function keyUpHandler(e) {
}

function mouseMoveHandler(e) {
}

function mouseClickHandler(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

// function drawPaddle() {
//   ctx.beginPath();
//   ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
//   ctx.fillStyle = "#0095DD";
//   ctx.fill();
//   ctx.closePath();
// }

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#333333";
    ctx.fill();

    map.draw();

    ship.move();
    ship.draw();
    ship.checkCollision();

    requestAnimationFrame(draw);
}

var ship = new Ship({radius: 3, x: canvas.width/2 - 5, y:canvas.height/2 - 5, speed: 1});
var map = new Map();
map.addRandomPlanetsAndStars();
draw();
