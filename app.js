var canvas = document.getElementById("pocketUniverse");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

canvas.addEventListener("click", mouseClickHandler, false);

document.getElementById('saveButton').addEventListener('click', function() {
    localStorage.setItem('space-ship-state', JSON.stringify(ship));
    localStorage.setItem('space-map-state', JSON.stringify(map));
    localStorage.setItem('space-viewport-state', JSON.stringify(viewport));
});

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
    ctx.fillStyle = "#080517";
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

var size =  1000;
var radius = 3;

var ship = JSON.parse(localStorage.getItem('space-ship-state'));

var mouseX;
var mouseY;

if (!ship) {
    mouseX = size/2 - radius/2;
    mouseY = size/2 - radius/2;
    ship = new Ship(radius, mouseX, mouseY, 1, 2500);
}
else {
    ship = Object.assign(new Ship(), ship);
    mouseX = ship.x;
    mouseY = ship.y;
}

var map = JSON.parse(localStorage.getItem('space-map-state'));

if (!map) {
    map = new Map(size);
    map.addChunk(0,0);
}
else {
    map = Object.assign(new Map(), map);

    for (var i = 0; i < map.chunks.length; i++) {
        map.chunks[i] = Object.assign(new Chunk(), map.chunks[i]);

        for (var j = 0; j < map.chunks[i].backgroundStars.length; j++) {
            map.chunks[i].backgroundStars[j] = Object.assign(new BackgroundStar(), map.chunks[i].backgroundStars[j]);
        }

        for (var k = 0; k < map.chunks[i].allAstronomicalObjects.length; k++) {
            switch (map.chunks[i].allAstronomicalObjects[k].type) {
                case 'star': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Star(), map.chunks[i].allAstronomicalObjects[k]);
                    break;
                case 'planet': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Planet(), map.chunks[i].allAstronomicalObjects[k]);
                    break;
                case 'nebula': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Nebula(), map.chunks[i].allAstronomicalObjects[k]);
                    break;
                case 'asteroid': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Asteroid(), map.chunks[i].allAstronomicalObjects[k]);
                    break; 
            }   
        }
    }
}

var viewport = JSON.parse(localStorage.getItem('space-viewport-state'));

if (!viewport) {
    viewport = new Viewport(0,0);
}
else {
    viewport = Object.assign(new Viewport(), viewport);
}

draw();
