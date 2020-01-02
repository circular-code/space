'use strict';
var canvas = document.getElementById("pocketUniverse");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var wPressed = false;
var sPressed = false;
var aPressed = false;
var dPressed = false;
var angle = 0;

//TODO: enter/exit fullscreen buttons
//var requestedFullscreen = false;
//document.onclick = function () {
//    if (requestedFullscreen)
//        return false;
//
//    requestedFullscreen = true;
//
//    if (canvas.requestFullscreen) {
//        canvas.requestFullscreen();
//    }
//    else if (canvas.mozRequestFullScreen) { /* Firefox */
//        canvas.mozRequestFullScreen();
//    }
//    else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
//        canvas.webkitRequestFullscreen();
//    }
//    else if (canvas.msRequestFullscreen) { /* IE/Edge */
//        canvas.msRequestFullscreen();
//    }
//}

//TODO: adjust render distance to zoom level, and refocus on center (ship)
//TODO: adjust amount of astrobject created with scale
//TODO: change to es6 style
//TODO: fade nebulae borders
//TODO: make empty energy blink red
//TODO: space nyan cat
//TODO: implement space stations, shipwrecks, star bases and other discoverable objects
//TODO: name astrobjects, colonized planets/moons? fractions/reputation?
//TODO: populate shipyards
//TODO: populate trading posts
//TODO: replace backgroundstars with very slowly moving star panes 1-3 - test https://codepen.io/jpalmieri/pen/PJLNZP
//TODO: draw basic ship models instead of circle
//TODO: ability to place markers, will show on the screen borders
//TODO: fix context menu position

var zoom = 100;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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
});

canvas.addEventListener("click", mouseClickHandler, false);

document.getElementById('saveButton').addEventListener('click', function() {

    var obj = {
        ship: ship,
        map: map,
        viewport: viewport
    };

    download(JSON.stringify(obj), 'space-game', 'application/json');
});

const menu = document.getElementById("menu");
let menuVisible = false;

const toggleMenu = command => {
    menu.style.display = command === "show" ? "block" : "none";
    menuVisible = !menuVisible;
    console.log(menu.style.display);
};

const setPosition = (top, left ) => {
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    toggleMenu("show");
};

canvas.addEventListener("click", e => {
    if (menuVisible)toggleMenu("hide");
});

canvas.addEventListener("contextmenu", e => {
    e.preventDefault();

    var translatedX = e.pageX + viewport.x;
    var tranlatedY = e.pageY + viewport.y;

    if (map.activeChunk) {

        var all = map.activeChunk.allAstrobjects;

        var astrobject;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(1, translatedX, tranlatedY)) {
                    astrobject = all[i];
                    break;
                }
            }
        }

        if (astrobject)
            setPosition(e.pageX, e.pageY);
        else if (menuVisible)
            toggleMenu("hide");
    }

    return false;
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

function renderLoop(now) {

    var timeDelta = (now - time) / 1000;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0 + viewport.x, 0 + viewport.y, canvas.width + viewport.x, canvas.height + viewport.y);

    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#08050C";
    ctx.fill();

    //render static background stars
    for (var j = 0; j < map.backgroundStars.length; j++) {
        Renderer.renderAstrobject(map.backgroundStars[j], true);
    }

    if (timeDelta)
        ship.move(timeDelta);

    ship.checkActiveChunk();

    viewport.focus();
    ctx.scale(zoom/100, zoom/100);
    ctx.translate(-viewport.x, -viewport.y);
    viewport.focus();

    Renderer.renderMap(map);
    Renderer.renderShip(ship);
    ship.checkCollision();

    if (timeDelta)
        ship.refuelEnergy(timeDelta);

    ship.mine();

    time = now;

    if (typeof userInterface !== 'undefined') {
        if (userInterface.speed && ship.engine) {
            userInterface.speed.textContent = ship.engine.speed;
        }
        if (userInterface.xCoordinate) {
            userInterface.xCoordinate.textContent = Math.round(ship.x) / 1000;
        }
        if (userInterface.yCoordinate) {
            userInterface.yCoordinate.textContent = Math.round(ship.y) / 1000;
        }
    }
    //returns a DomHighResTimestamp, use maybe instead of Date.now() ?
    requestAnimationFrame(renderLoop);
}

var scale = 1;
var size = 3000 * scale * scale;
var r = 3;

// var ship = JSON.parse(localStorage.getItem('space-ship-state'));
var mouseX = size/2 - r/2;
var mouseY = size/2 - r/2;

userInterface.create();

var map = new Map(size, scale);
map.addChunk(0,0);
map.generateBackground();

var ship = new Ship(r, mouseX, mouseY, size);

var viewport = new Viewport(0,0);

renderLoop();

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
    else {
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
    console.log(event.target.result);
    var obj = JSON.parse(event.target.result);
    
    ship = Object.assign(new Ship(), obj.ship);

    document.getElementById('storage').innerHTML = '';

    var length = ship.storages.length;
    for (let i = 0; i < length; i++) {
        ship.storages.push(Object.assign(new Storage(true), ship.storages[i]));
        ship.storages[i+length].createUI();
        ship.storages[i+length].refresh();
    }
    ship.storages.splice(0,length);

    mouseX = ship.x;
    mouseY = ship.y;

    //TODO: map load besser implementieren, ui clearen, gesamtes system "ladebereit" aufsetzen
    map = Object.assign(new Map(), obj.map);

    for (var i = 0; i < map.chunks.length; i++) {
        map.chunks[i] = Object.assign(new Chunk(), map.chunks[i]);

        for (var j = 0; j < map.chunks[i].backgroundStars.length; j++) {
            map.chunks[i].backgroundStars[j] = Object.assign(new BackgroundStar(), map.chunks[i].backgroundStars[j]);
        }

        for (var k = 0; k < map.chunks[i].allAstrobjects.length; k++) {

            let astrobject = map.chunks[i].allAstrobjects[k];

            switch (astrobject.name) {
                case 'Star':
                    astrobject = Object.assign(new Star(true), astrobject);
                    break;
                case 'Planet':
                    let length = ship.storages.length;
                    astrobject = Object.assign(new Planet(true), astrobject);
                    if (astrobject.resources) {
                        for (let i = 0; i < astrobject.resources.length; i++) {
                            astrobject.resources.push(Object.assign(new Resource(true), astrobject.resources[i]));
                        }
                        astrobject.resources.splice(0,length);
                    }
                    break;
                case 'Nebula':
                    astrobject = Object.assign(new Nebula(true), astrobject);
                    break;
                case 'Asteroid':
                    astrobject = Object.assign(new Asteroid(true), astrobject);
                    break;
                case 'Wormhole':
                    astrobject = Object.assign(new Wormhole(true), astrobject);
                    break;
                case 'Moon':
                    astrobject = Object.assign(new Moon(true), astrobject);
                    break;
                case 'TradingPost':
                    astrobject = Object.assign(new TradingPost(true), astrobject);
                    break;
                case 'ShipYard':
                    astrobject = Object.assign(new ShipYard(true), astrobject);
                    break;
        }
        }
    }

    viewport = Object.assign(new Viewport(), obj.viewport);
}

document.getElementById('fileUpload').addEventListener('change', onChange);

document.getElementById('options').addEventListener('click', function() {
    var optionsContainer = document.getElementById('optionsContainer');
    if (optionsContainer.classList.contains('visible')) {
        optionsContainer.classList.remove('visible');
    }
    else {
        optionsContainer.classList.add('visible');
    }
});
