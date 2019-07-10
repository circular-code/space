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

function collisionDetection() {
}

function Ship (params) {
    // this.width = params.width;
    // this.height = params.height;
    this.radius = params.radius;
    this.x = params.x;
    this.y = params.y;
    this.speed = params.speed;
}
Ship.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = "#eeeeee";
    ctx.fill();
    ctx.closePath();
}
Ship.prototype.move = function() {
    if (this.x < mouseX) {
        if ((this.x + this.speed) > mouseX) {
            this.x = mouseX;
        }
        else {
            this.x += this.speed;
        }
    }
    else if (this.x > mouseX) {
        if ((this.x + this.speed) < mouseX) {
            this.x = mouseX;
        }
        else {
            this.x -= this.speed;
        }
    }
    if (this.y < mouseY) {
        if ((this.y + this.speed) > mouseY) {
            this.y = mouseY;
        }
        else {
            this.y += this.speed;
        }
    }
    else if (this.y > mouseY) {
        if ((this.y + this.speed) < mouseY) {
            this.y = mouseY;
        }
        else {
            this.y -= this.speed;
        }
    }
}

function Map () {
    this.planets = [];
    this.suns = [];
    this.addRandomPlanetsAndSuns = function() {

        var planetAmount = randomNumBetween(10);
        while (planetAmount) {

            this.planets.push(new Planet());
            planetAmount--;
        }

        var sunAmount = randomNumBetween(10);
        while (sunAmount) {
            this.suns.push(new Sun());
            sunAmount--;
        }
    }
    this.draw = function() {
        var i = 0, j = 0;
        for (i; i< planets.length; i++) {
            planets[i].draw();
        }
        for (j; j< planets.length; j++) {
            suns[j].draw();
        }
    }
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
  ship.move();
  ship.draw();
  collisionDetection();

  requestAnimationFrame(draw);
}

var ship = new Ship({radius: 10, x: canvas.width/2 - 5, y:canvas.height/2 - 5, speed: 5});
var map = new Map();
draw();
