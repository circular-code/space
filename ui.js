'use strict';
var userInterface = (function() {

    ui.menuVisible = false;
    var requestedFullscreen = false;

    const DOM = {
        root:document.getElementById('ui'),
        addFlag: document.getElementById('addFlag'),
        removeFlag: document.getElementById('removeFlag'),
        requestLanding: document.getElementById('requestLanding'),
        spaceJump: document.getElementById('spaceJump'),
        options:  document.getElementById('options'),
        expand: document.getElementById("expand"),
        compress: document.getElementById("compress"),
        saveButton: document.getElementById('saveButton'),
        uploadFile: document.getElementById('uploadFile'),
        menu: document.getElementById('menu')
    };

    ui.init = function() {
       ui.initHandlers();
    };

    ui.create = function() {
        DOM.root.appendChild(ui.createShip());
        DOM.root.appendChild(ui.createStorage());
        DOM.root.appendChild(ui.createInfo());
    };

    ui.createShip = function() {
        var container = document.createElement('div');
        container.id = 'ship';

        return container;
    };

    ui.createInfo = function() {
        var container = document.createElement('div');
        container.id = 'info';

        var credits = document.createElement('div');
        credits.id = 'credits';
        this.credits = credits;

        var speed = document.createElement('div');
        speed.id = 'speed';
        this.speed = speed;

        var xCoordinate = document.createElement('div');
        xCoordinate.id = 'xCoordinate';
        this.xCoordinate = xCoordinate;

        var seperator = document.createElement('div');
        seperator.id = 'seperator';
        seperator.textContent = '/';

        var yCoordinate = document.createElement('div');
        yCoordinate.id = 'yCoordinate';
        this.yCoordinate = yCoordinate;

        container.appendChild(xCoordinate);
        container.appendChild(seperator);
        container.appendChild(yCoordinate);
        container.appendChild(speed);
        container.appendChild(credits);

        return container;
    };

    ui.createStorage = function() {
        var container = document.createElement('div');
        container.id = 'storage';

        return container;
    };

    ui.manageContextMenuOptions = function(astrobject) {
            
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
    };

    ui.initHandlers = function () {
         
        document.addEventListener("keydown", ui.handlers.keyDown, false);
        document.addEventListener("keyup", ui.handlers.keyUp, false);
        window.addEventListener('resize', ui.handlers.resize);
        
        DOM.uploadFile.addEventListener('change', ui.handlers.uploadFile);
        DOM.addFlag.addEventListener('click', ui.handlers.addFlag);
        DOM.removeFlag.addEventListener('click', ui.handlers.removeFlag);
        DOM.requestLanding.addEventListener('click', ui.handlers.requestLanding);
        DOM.spaceJump.addEventListener('click', ui.handlers.spaceJump);  
        DOM.options.addEventListener('click', ui.handlers.options);
        DOM.saveButton.addEventListener('click', ui.handlers.saveButton);
        DOM.expand.addEventListener('click', ui.handlers.expand);
        DOM.compress.addEventListener('click', ui.handlers.compress);
    };

    ui.handlers = {
        compress: function () {
            if (!requestedFullscreen)
                return false;

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
             DOM.compress.style.display = 'none';
             DOM.expand.style.display = 'inline-block';
        },
        expand: function () {
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
         
            DOM.compress.style.display = 'inline-block';
            DOM.expand.style.display = 'none';
        },
        saveButton: function() {

            var obj = {
                ship: app.ship,
                map: app.map,
                viewport: app.viewport
            };

            ui.download(JSON.stringify(obj), 'space-game', 'application/json');
        },
        options: function() {
            var optionsContainer = document.getElementById('optionsContainer');
            if (optionsContainer.classList.contains('visible')) {
                optionsContainer.classList.remove('visible');
            }
            else {
                optionsContainer.classList.add('visible');
            }
        },
        spaceJump: function() {
            if (app.ship.engine.speed < app.ship.engine.speedMax) {
                alert('YOU NEED MORE SPEED');
                return;
            }
            else if (app.ship.jumptank.amount < 10) {
                alert('OUT OF JUMP FUEL');
                return;
            }
        
            app.ship.jumptank.amount -= 10;
        
            app.spaceJump = true;
        
            setTimeout(function() {
                app.spaceJump = undefined;
                app.blackout = true;
        
                app.ship.engine.speed = 5000;
        
                setTimeout(function() {
                    app.blackout = undefined;
                    app.ship.engine.speed = 350;
                }, 1000);
            }, 1000);
        },
        requestLanding: function() {
            if (app.ship.checkCollision(app.map.contextMenuAstrobject.range, app.map.contextMenuAstrobject.x, app.map.contextMenuAstrobject.y)){
                alert('Landing granted.');
                createTradePostModal(app.map.contextMenuAstrobject);
                document.getElementById("modal1").classList.add("is-visible");
            }
            else
                alert('Too far away.');

            canvas.click();
        },
        addFlag: function() {
            if (app.map.contextMenuAstrobject && app.map.contextMenuAstrobject.hasFlag === false) {
                app.map.contextMenuAstrobject.hasFlag = true;
                app.map.flaggedAstrobjects.push(app.map.contextMenuAstrobject);
            }
            else if (app.map.contextMenuAstrobject && app.map.contextMenuAstrobject.hasFlag === true)
                alert.log('astrobject already has a flag');

            canvas.click();
        },
        removeFlag: function() {
            if (app.map.contextMenuAstrobject && app.map.contextMenuAstrobject.hasFlag === true) {
                app.map.contextMenuAstrobject.hasFlag = false;
                var index = app.map.flaggedAstrobjects.indexOf(app.map.contextMenuAstrobject);
                if (index > -1) {
                    app.map.flaggedAstrobjects.splice(index, 1);
                }
            }
            else if (app.map.contextMenuAstrobject && app.map.contextMenuAstrobject.hasFlag === false)
                alert.log('astrobject has no flag that could be removed');

            canvas.click();
        },
        keyDown: function(e) {
            if (e.keyCode === 87) {
                app.wPressed = true;
            }
            else if (e.keyCode === 83) {
                app.sPressed = true;
            }
            else if (e.keyCode === 65) {
                app.aPressed = true;
            }
            else if (e.keyCode === 68) {
                app.dPressed = true;
            }
            else if (e.keyCode === 122) {
                if (expand.style.display === 'none' || expand.style.display === '') {
                    DOM.compress.style.display = 'none';
                    DOM.expand.style.display = 'inline-block';
                }
                else {
                    DOM.compress.style.display = 'inline-block';
                    DOM.expand.style.display = 'none';
                }
            }
        },
        keyUp: function(e) {
            if (e.keyCode === 87) {
                app.wPressed = false;
            }
            else if (e.keyCode === 83) {
                app.sPressed = false;
            }
            else if (e.keyCode === 65) {
                app.aPressed = false;
            }
            else if (e.keyCode === 68) {
                app.dPressed = false;
            }
        },
        mouseClick: function(e) {
            mouseX = e.clientX + viewport.x;
            mouseY = e.clientY + viewport.y;
        },
        handleScroll: function(e) {
            if (e.wheelDelta < 0 && app.zoom !== 50)
                app.zoom--;
            else if (e.wheelDelta > 0 !== 150)
                app.zoom++;

            return e.preventDefault() && false;
        },
        uploadFile: function(event) {
            var reader = new FileReader();
            reader.onload = ui.copyGameState;
            reader.readAsText(event.target.files[0]);
        },
        resize: function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    };

    ui.download = function (data, filename, type) {
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
    };

    ui.copyGameState = function(event) {
        var obj = JSON.parse(event.target.result);

        app.ship = Object.assign(new Ship(), obj.ship);

        document.getElementById('storage').innerHTML = '';

        var length = app.ship.storages.length;
        for (let i = 0; i < length; i++) {
            app.ship.storages.push(Object.assign(new Storage(true), app.ship.storages[i]));
            app.ship.storages[i+length].createUI();
            app.ship.storages[i+length].refresh();
        }
        app.ship.storages.splice(0,length);

        mouseX = app.ship.x;
        mouseY = app.ship.y;

        //TODO: map load besser implementieren, ui clearen, gesamtes system "ladebereit" aufsetzen
        map = Object.assign(new Map(), obj.map);

        for (var i = 0; i < app.map.chunks.length; i++) {
            app.map.chunks[i] = Object.assign(new Chunk(), app.map.chunks[i]);

            for (var j = 0; j < app.map.chunks[i].backgroundStars.length; j++) {
                app.map.chunks[i].backgroundStars[j] = Object.assign(new BackgroundStar(), app.map.chunks[i].backgroundStars[j]);
            }

            for (var k = 0; k < app.map.chunks[i].allAstrobjects.length; k++) {

                let astrobject = app.map.chunks[i].allAstrobjects[k];

                switch (astrobject.name) {
                    case 'Star':
                        astrobject = Object.assign(new Star(true), astrobject);
                        break;
                    case 'Planet':
                        let length = app.ship.storages.length;
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
    };

    ui.toggleMenu = command => {
        DOM.menu.style.display = command === "show" ? "block" : "none";
        ui.menuVisible = command === "show";
    };
    
    ui.setPosition = (top, left ) => {
        DOM.menu.style.left = left + 'px';
        DOM.menu.style.top = top + 'px';
        ui.toggleMenu("show");
    };

    return ui;
})();

