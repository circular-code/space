var canvas = document.getElementById("pocketUniverse");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var wPressed = false;
var sPressed = false;
var aPressed = false;
var dPressed = false;
var angle = 0;

//TODO: adjust render distance to zoom level, and refocus on center (ship)
var zoom = 100;

var ui = {
    crystal: document.getElementById('crystal'),
    gas: document.getElementById('gas'),
    metal: document.getElementById('metal'),
    getResource: function(resource) {
        return this[resource].innerText;
    },
    setResource: function(resource, value) {
        this[resource].innerText = value;
    },
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// document.getElementById('scaleSlider').addEventListener('change', function(e) {
//     zoom = +e.currentTarget.value;
// });

var handleScroll = function(e){
    if (e.wheelDelta < 0 && zoom !== 50)
        zoom--;
    else if (e.wheelDelta > 0 !== 150)
        zoom++;

    return e.preventDefault() && false;
};

canvas.addEventListener('DOMMouseScroll',handleScroll,false);
canvas.addEventListener('mousewheel',handleScroll,false);

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

function randomNumBetween(max, min, convertToHex) {
    if (typeof max === 'undefined'){
        console.error('max undefined');
        return false;
    }
    if (typeof min === 'undefined'){
        min = 0;
    }

    var number = Math.floor(Math.random()*(max-min)+min);
    
    if (convertToHex) {
        number = number.toString(16);
        return number.length === 1 ? '0' + number : number;
    }
    else
        return number;
}

function keyDownHandler(e) {
    if (e.keyCode === 87) {
        wPressed = true;
    }
    else if (e.keyCode === 83) {
        sPressed = true;
    }
    else if (e.keyCode === 65) {
        aPressed = true;
    }
    else if (e.keyCode === 68) {
        dPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 87) {
        wPressed = false;
    }
    else if (e.keyCode === 83) {
        sPressed = false;
    }
    else if (e.keyCode === 65) {
        aPressed = false;
    }
    else if (e.keyCode === 68) {
        dPressed = false;
    }
}

function mouseClickHandler(e) {
    mouseX = e.clientX + viewport.x;
    mouseY = e.clientY + viewport.y;
}

function distance (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

var time = Date.now();

function draw() {

    var now = Date.now(),
    dt = (now - time) / 1000.0;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0 + viewport.x, 0 + viewport.y, canvas.width + viewport.x, canvas.height + viewport.y);
    
    // ctx.translate(viewport.x, viewport.y);

    // ctx.translate(-viewport.x,- viewport.y);
    
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#08050C";
    ctx.fill();

    if (dt)
        ship.move(dt);

    ship.checkActiveChunk();

    viewport.focus();
    ctx.scale(zoom/100, zoom/100);
    ctx.translate(-viewport.x, -viewport.y);
    viewport.focus();

    map.draw();
    ship.draw();
    ship.checkCollision();

    if (dt)
        ship.refuelEnergy(dt);

    ship.mine();

    time = now;

    //returns a DomHighResTimestamp, use maybe instead of Date.now() ?
    requestAnimationFrame(draw);
}

var scale = 1;
var size = 3000 * scale * scale;
var radius = 3;

var ship = JSON.parse(localStorage.getItem('space-ship-state'));

var mouseX;
var mouseY;

if (!ship) {
    mouseX = size/2 - radius/2;
    mouseY = size/2 - radius/2;
    ship = new Ship(radius, mouseX, mouseY, 2500);
}
else {
    ship = Object.assign(new Ship(), ship);
    mouseX = ship.x;
    mouseY = ship.y;
}

userInterface.create();

var map = JSON.parse(localStorage.getItem('space-map-state'));

if (!map) {
    map = new Map(size, scale);
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
            switch (map.chunks[i].allAstronomicalObjects[k].name) {
                case 'Star': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Star(), map.chunks[i].allAstronomicalObjects[k]);
                    break;
                case 'Planet': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Planet(), map.chunks[i].allAstronomicalObjects[k]);
                    break;
                case 'Nebula': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Nebula(), map.chunks[i].allAstronomicalObjects[k]);
                    break;
                case 'Asteroid': 
                    map.chunks[i].allAstronomicalObjects[k] = Object.assign(new Asteroid(), map.chunks[i].allAstronomicalObjects[k]);
                    break; 
            }   
        }
    }
}

var viewport = JSON.parse(localStorage.getItem('space-viewport-state'));

if (!viewport)
    viewport = new Viewport(0,0);
else
    viewport = Object.assign(new Viewport(), viewport);

draw();
