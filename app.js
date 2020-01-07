'use strict';
var canvas = document.getElementById("pocketUniverse");
var expand = document.getElementById("expand");
var compress = document.getElementById("compress");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var wPressed = false;
var sPressed = false;
var aPressed = false;
var dPressed = false;
var angle = 0;

var requestedFullscreen = false;
expand.onclick = function () {
   if (requestedFullscreen)
       return false;

   requestedFullscreen = true;

   if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
   }
   else if (document.body.mozRequestFullScreen) { /* Firefox */
        document.body.mozRequestFullScreen();
   }
   else if (document.body.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        document.body.webkitRequestFullscreen();
   }
   else if (document.body.msRequestFullscreen) { /* IE/Edge */
        document.body.msRequestFullscreen();
   }

   compress.style.display = 'inline-block';
   expand.style.display = 'none';
}

compress.onclick = function () {
   if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    requestedFullscreen = false;
    compress.style.display = 'none';
    expand.style.display = 'inline-block';
}

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
    menuVisible = command === "show";
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

    if (viewport.isInside(translatedX, tranlatedY)) {

        var all = getClosestObjects(map.activeChunk);

        var astrobject;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(1, translatedX, tranlatedY)) {
                    astrobject = all[i];
                    break;
                }
            }
        }

        if (astrobject) {
            map.contextMenuAstrobject = astrobject;
            manageContextMenuOptions(astrobject);
            setPosition(e.pageY, e.pageX);
        }
        else {
            toggleMenu("hide");
            map.contextMenuAstrobject = undefined;
        }
    }

    return false;
});

document.getElementById('addFlag').addEventListener('click', function() {
    if (map.contextMenuAstrobject && map.contextMenuAstrobject.hasFlag === false) {
        map.contextMenuAstrobject.hasFlag = true;
        map.flaggedAstrobjects.push(map.contextMenuAstrobject);
    }
    else if (map.contextMenuAstrobject && map.contextMenuAstrobject.hasFlag === true)
        alert.log('astrobject already has a flag');

    canvas.click();
});

document.getElementById('removeFlag').addEventListener('click', function() {
    if (map.contextMenuAstrobject && map.contextMenuAstrobject.hasFlag === true) {
        map.contextMenuAstrobject.hasFlag = false;
        var index = map.flaggedAstrobjects.indexOf(map.contextMenuAstrobject);
        if (index > -1) {
            map.flaggedAstrobjects.splice(index, 1);
        }
    }
    else if (map.contextMenuAstrobject && map.contextMenuAstrobject.hasFlag === false)
        alert.log('astrobject has no flag that could be removed');

    canvas.click();
});

document.getElementById('requestLanding').addEventListener('click', function() {
    if (ship.checkCollision(map.contextMenuAstrobject.range, map.contextMenuAstrobject.x, map.contextMenuAstrobject.y)){
        alert('Landing granted.');
        createTradePostModal(map.contextMenuAstrobject);
        document.getElementById("modal1").classList.add("is-visible");
    }
    else
        alert('Too far away.');

    canvas.click();
});

var spaceJump = undefined;
var blackout = undefined;

document.getElementById('spaceJump').addEventListener('click', function() {
    if (ship.engine.speed < ship.engine.speedMax) {
        alert('YOU NEED MORE SPEED');
        return;
    }
    else if (ship.jumptank.amount < 10) {
        alert('OUT OF JUMP FUEL');
        return;
    }

    ship.jumptank.amount -= 10;

    spaceJump = true;

    setTimeout(function() {
        spaceJump = undefined;
        blackout = true;

        ship.engine.speed = 5000;

        setTimeout(function() {
            blackout = undefined;
            ship.engine.speed = 350;
        }, 1000);
    }, 1000);
});

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
    else if (e.keyCode === 122) {
        if (expand.style.display === 'none' || expand.style.display === '') {
            compress.style.display = 'none';
            expand.style.display = 'inline-block';
        }
        else {
            compress.style.display = 'inline-block';
            expand.style.display = 'none';
        }
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

var time = Date.now();

function renderLoop(now) {

    var timeDelta = (now - time) / 1000;

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (typeof spaceJump === 'undefined') {
        ctx.clearRect(0 + viewport.x, 0 + viewport.y, canvas.width + viewport.x, canvas.height + viewport.y);

        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#08050C";
        ctx.fill();
    }

    //render static background stars
    for (var j = 0; j < map.backgroundStars[0].length; j++) {
        Renderer.renderAstrobject(map.backgroundStars[0][j], 1, timeDelta);
    }
    for (j = 0; j < map.backgroundStars[1].length; j++) {
        Renderer.renderAstrobject(map.backgroundStars[1][j], 2, timeDelta);
    }
    for (j = 0; j < map.backgroundStars[2].length; j++) {
        Renderer.renderAstrobject(map.backgroundStars[2][j], 3, timeDelta);
    }

    if (timeDelta)
        ship.move(timeDelta);

    ship.checkActiveChunk();

    ctx.translate(-viewport.x * (zoom/100), -viewport.y * (zoom/100));
    ctx.scale(zoom/100, zoom/100);
    viewport.focus();

    // if (typeof spaceJump === 'undefined') {
    //     Renderer.renderMap(map);
    //     Renderer.renderShip(ship);
    // }
    Renderer.renderMap(map);
    Renderer.renderShip(ship);
    ship.checkAllCollisions();

    if (timeDelta)
        ship.refuelEnergy(timeDelta);

    ship.mine();

    time = now;

    if (typeof userInterface !== 'undefined') {
        if (typeof ship.credits === 'number' && ship.credits === ship.credits) {
            userInterface.credits.textContent = ship.credits + ' $';
        }
        if (userInterface.speed && ship.engine) {
            userInterface.speed.textContent = pad(ship.engine.speed, 3);
        }
        if (userInterface.xCoordinate) {
            userInterface.xCoordinate.textContent = (Math.round(ship.x) / 1000).toFixed(3);
        }
        if (userInterface.yCoordinate) {
            userInterface.yCoordinate.textContent = (Math.round(ship.y) / 1000).toFixed(3);
        }
    }

    requestAnimationFrame(renderLoop);
}

var scale = 1;
// var scale = 5;
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

function manageContextMenuOptions (astrobject) {

    var addFlag = document.getElementById('addFlag');
    var removeFlag = document.getElementById('removeFlag');
    var requestLanding = document.getElementById('requestLanding');
    var scanPlanet = document.getElementById('scanPlanet');

    switch(astrobject.name) {

        case 'TradingPost':
        case 'ShipYard':
            addFlag.style.display = 'block';
            removeFlag.style.display = 'block';
            requestLanding.style.display = 'block';
            scanPlanet.style.display = 'none';
            break;

        case 'Planet':
            addFlag.style.display = 'block';
            removeFlag.style.display = 'block';
            requestLanding.style.display = 'none';
            scanPlanet.style.display = 'block';
            break;

        default:
            addFlag.style.display = 'block';
            removeFlag.style.display = 'block';
            requestLanding.style.display = 'none';
            scanPlanet.style.display = 'none';
    }
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}