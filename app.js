var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var mouseX = 0;
var mouseY = 0;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
}

function keyUpHandler(e) {
}

function mouseMoveHandler(e) {
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
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = "#eeeeee";
        ctx.fill();
        ctx.closePath();
    }
    this.move = function() {
        if (this.x < mouseX) {
            this.x += this.speed;
        }
        else if (this.x > mouseX) {
            this.x -= this.speed;
        }
        if (this.y < mouseY) {
            this.y += this.speed;
        }
        else if (this.y > mouseY) {
            this.y -= this.speed;
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
draw();