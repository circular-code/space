'use strict';
var userInterface = (function() {

    ui.menuVisible = false;
    var requestedFullscreen = false;

    const dom = {
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
        dom.root.appendChild(ui.createShip());
        dom.root.appendChild(ui.createStorage());
        dom.root.appendChild(ui.createInfo());
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
        
        dom.uploadFile.addEventListener('change', ui.handlers.uploadFile);
        dom.addFlag.addEventListener('click', ui.handlers.addFlag);
        dom.removeFlag.addEventListener('click', ui.handlers.removeFlag);
        dom.requestLanding.addEventListener('click', ui.handlers.requestLanding);
        dom.spaceJump.addEventListener('click', ui.handlers.spaceJump);  
        dom.options.addEventListener('click', ui.handlers.options);
        dom.saveButton.addEventListener('click', ui.handlers.saveButton);
        dom.expand.addEventListener('click', ui.handlers.expand);
        dom.compress.addEventListener('click', ui.handlers.compress);
    };

    ui.handlers = {
        compress: function () {
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
             dom.expandcompress.style.display = 'none';
             dom.expandexpand.style.display = 'inline-block';
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
         
            dom.compress.style.display = 'inline-block';
            dom.expand.style.display = 'none';
        },
        saveButton: function() {

            var obj = {
                ship: ship,
                map: map,
                viewport: viewport
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
        spacejump: function() {
            if (ship.engine.speed < ship.engine.speedMax) {
                alert('YOU NEED MORE SPEED');
                return;
            }
            else if (ship.jumptank.amount < 10) {
                alert('OUT OF JUMP FUEL');
                return;
            }
        
            ship.jumptank.amount -= 10;
        
            app.spaceJump = true;
        
            setTimeout(function() {
                app.spaceJump = undefined;
                app.blackout = true;
        
                ship.engine.speed = 5000;
        
                setTimeout(function() {
                    app.blackout = undefined;
                    ship.engine.speed = 350;
                }, 1000);
            }, 1000);
        },
        requestLanding: function() {
            if (ship.checkCollision(map.contextMenuAstrobject.range, map.contextMenuAstrobject.x, map.contextMenuAstrobject.y)){
                alert('Landing granted.');
                createTradePostModal(map.contextMenuAstrobject);
                document.getElementById("modal1").classList.add("is-visible");
            }
            else
                alert('Too far away.');

            canvas.click();
        },
        addFlag: function() {
            if (map.contextMenuAstrobject && map.contextMenuAstrobject.hasFlag === false) {
                map.contextMenuAstrobject.hasFlag = true;
                map.flaggedAstrobjects.push(map.contextMenuAstrobject);
            }
            else if (map.contextMenuAstrobject && map.contextMenuAstrobject.hasFlag === true)
                alert.log('astrobject already has a flag');

            canvas.click();
        },
        removeFlag: function() {
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
                    dom.compress.style.display = 'none';
                    dom.expand.style.display = 'inline-block';
                }
                else {
                    dom.compress.style.display = 'inline-block';
                    dom.expand.style.display = 'none';
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
    };

    ui.toggleMenu = command => {
        menu.style.display = command === "show" ? "block" : "none";
        menuVisible = command === "show";
    };
    
    ui.setPosition = (top, left ) => {
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
        ui.toggleMenu("show");
    };

    return ui;
})();

