'use strict';

var app = (function() {
    
    var global = {
        wPressed: false,
        sPressed: false,
        aPressed: false,
        dPressed: false,
        // angle: 0,
        zoom: 100,
        spaceJump: undefined,
        blackout: undefined,
        scale: 1,
    };

    global.size = 3000 * global.scale * global.scale,
    global.r = 3;
    global.mouseX = global.size/2 - global.r/2;
    global.mouseY = global.size/2 - global.r/2;

    var time = Date.now();
    // var ship = JSON.parse(localStorage.getItem('space-ship-state'));
    
    global.renderLoop = function(now) {
    
        var timeDelta = (now - time) / 1000;
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        if (typeof spaceJump === 'undefined') {
            ctx.clearRect(0 + global.viewport.x, 0 + global.viewport.y, canvas.width + global.viewport.x, canvas.height + global.viewport.y);
            
            ctx.rect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#08050C";
            ctx.fill();
        }
        
        //render static background stars
        for (var j = 0; j < global.map.backgroundStars[0].length; j++) {
            Renderer.renderAstrobject(global.map.backgroundStars[0][j], 1, timeDelta);
        }
        for (j = 0; j < global.map.backgroundStars[1].length; j++) {
            Renderer.renderAstrobject(global.map.backgroundStars[1][j], 2, timeDelta);
        }
        for (j = 0; j < global.map.backgroundStars[2].length; j++) {
            Renderer.renderAstrobject(global.map.backgroundStars[2][j], 3, timeDelta);
        }
        
        if (timeDelta)
        ship.move(timeDelta);
        
        ship.checkActiveChunk();
        
        ctx.translate(-global.viewport.x * (zoom/100), -global.viewport.y * (zoom/100));
        ctx.scale(zoom/100, zoom/100);
        global.viewport.focus();
        
        // if (typeof spaceJump === 'undefined') {
            //     Renderer.renderMap(map);
            //     Renderer.renderShip(ship);
            // }
            Renderer.renderMap(map);
            Renderer.renderShip(ship);
            global.ship.checkCollisions();
            
            if (timeDelta)
                global.ship.refuelEnergy(timeDelta);
            
            global.ship.mine();
            
            time = now;
            
            if (typeof userInterface !== 'undefined') {
            if (typeof global.ship.credits === 'number' && global.ship.credits === global.ship.credits) {
                userInterface.credits.textContent = ship.credits + ' $';
            }
            if (userInterface.speed && ship.engine) {
                userInterface.speed.textContent = pad(global.ship.engine.speed, 3);
            }
            if (userInterface.xCoordinate) {
                userInterface.xCoordinate.textContent = (Math.round(global.ship.x) / 1000).toFixed(3);
            }
            if (userInterface.yCoordinate) {
                userInterface.yCoordinate.textContent = (Math.round(global.ship.y) / 1000).toFixed(3);
            }
        }
        
        requestAnimationFrame(global.renderLoop);
    };
    
    userInterface.init();
    userInterface.create();
    return global;
})();

app.map = new Map(app.size, app.scale);
app.ship = new Ship(app.r, app.mouseX, app.mouseY, app.size);
app.viewport = new Viewport(0,0);
app.renderLoop();

