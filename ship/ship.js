class Ship {

    constructor(size) {

        this.r = 3;
        this.x = randomNumBetween(size);
        this.y = randomNumBetween(size);
        this.spawnShip(size);

        // arms,
        // shields,
        // crew,
        // passengers,
        // bunks

        this.details = {
            manufacturer: "Corellian Engineering Corporation",
            name: "Milennium Falcon",
            class: "light frighter",
            model: "YT-1300",
            variant: "f"
        };

        this.energySources = [
            new StorageModule(undefined, 'energy', 100, 100, -100, 100, 50, 'energy'),
            new StorageModule(undefined, 'liquid', 100, 100, -100, 100, 50, 'fuel'),
            new StorageModule(undefined, 'liquid', 100, 100, -100, 100, 50, 'jumpfuel'),
        ];

        this.storages = [
            new StorageModule(undefined, 'solid', 0, 100, -100, 100),
            new StorageModule(undefined, 'plasma', 0, 100, -100, 100),
            new StorageModule(undefined, 'gas', 0, 100, -100, 100),
        ];

        //TODO: add energySource to Engine, use energySource of engine when flying

        this.engines = [
            new EngineModule(undefined, "energy", 0, 0, 0, 350, 1, true),
            new EngineModule(undefined, "fuel", 1, 0, 0, 200, 1),
            new EngineModule(undefined, "jump", 2, 0, 5000, 5000, 1),
        ];

        //TODO: module as index for slots
        
        this.slots = [
            new Slot("StorageModule", false, 1, 1, this.storages[0]),
            new Slot("StorageModule", false, 1, 1, this.storages[1]),
            new Slot("StorageModule", false, 1, 1, this.storages[2]),
            new Slot("StorageModule", false, 1, 1),
            new Slot("StorageModule", false, 1, 1, this.storages[3]),
            new Slot("StorageModule", false, 1, 1, this.storages[4]),
            new Slot("StorageModule", false, 1, 1,  this.storages[5]),
            new Slot("EngineModule", true, 1, 1, this.engines[0]),
            new Slot("EngineModule", true, 1, 1, this.engines[1]),
            new Slot("EngineModule", true, 1, 1, this.engines[2])
        ];

        this.credits = 13.37;

        this.storages.forEach(storage => {
            // if (storage.type === 'solid' || storage.type === 'liquid' || storage.type === 'gas' || storage.type === 'plasma')
            //     storage.createUI();
        });
    }

    spawnShip(size) {
        var collided = true;
        var genCounter = 0;

        while (collided) {

            collided = this.checkCollisions();

            if (collided) {
                this.x = randomNumBetween(size);
                this.y = randomNumBetween(size);
            }
            else {
                collided = false;
            }
            genCounter++;
            if (genCounter > 100) {
                console.error('Could not generate ship on map. Check map creation values.');
                collided = false;
            }
        }
    }

    checkActiveChunk() {

        if (app.map.activeChunk && app.map.activeChunk.active === true) {
            // if ship not inside chunk
            if (this.x < app.map.activeChunk.x * app.map.activeChunk.size ||
                app.ship.x > (app.map.activeChunk.x * app.map.activeChunk.size + app.map.activeChunk.size) ||
                app.ship.y < app.map.activeChunk.y * app.map.activeChunk.size ||
                app.ship.y > (app.map.activeChunk.y * app.map.activeChunk.size + app.map.activeChunk.size)) {
    
                app.map.activeChunk.active = false;
                this.checkActiveChunk();
            }
        }
        else {
            app.map.activeChunk = app.map.chunks.filter(function(chunk){
                return app.ship.x > chunk.x * chunk.size &&
                app.ship.x < (chunk.x * chunk.size + chunk.size) &&
                app.ship.y > chunk.y * chunk.size &&
                app.ship.y < (chunk.y * chunk.size + chunk.size);
            })[0];
    
            if (app.map.activeChunk) {
                app.map.activeChunk.active = true;
    
                app.map.generateChunksAroundChunk(app.map.activeChunk.x, app.map.activeChunk.y);
            }
            else {
                console.error('ship out of bounds');
            }
        }
    }

    refuelEnergy(timeDelta) {
        var ship = this;
    
        if (app.map.activeChunk) {
    
            var all = Chunk.getClosestObjects(app.map.activeChunk);
    
            var collidedObjects = all.filter(function(object) {
                return object.name === 'Star' ? distance(ship.x, ship.y, object.x, object.y) <= ship.r + object.range : false;
            });
    
            if (collidedObjects.length > 0 && this.storages[0].capacity > (this.storages[0].amount + Star.energyRegenerationAmount)) {
                this.storages[0].amount += Star.energyRegenerationAmount * timeDelta * collidedObjects.length;
            }
        }
    }

    // Mining unterteilen in resource types.
    // Unterschiedliche Geräte notwending für unterschiedliche typen
    // an Ressourcen je Aggregatszustand?

    mine(resource, amount) {

        var ship = this;
    
        if (app.map.activeChunk) {
    
            var all = Chunk.getClosestObjects(app.map.activeChunk);
    
            var collidedObjects = all.filter(function(object) {
                return object.r ? distance(ship.x, ship.y, object.x, object.y) <= object.r + 20 : false;
            });
    
            if (collidedObjects.length > 0) {
                var astrobject = collidedObjects[0];
                if (astrobject.name === 'Planet' &&  astrobject.planetType === 'giant' && (astrobject.planetSubType === 'gas' || astrobject.planetSubType === 'ice' || astrobject.planetSubType === 'solid' )) {
                    ship.store(astrobject.resources[0].retain(1), astrobject.resources[0].type);
                }
            }
        }
    }

    move(timeDelta) {

        if (this.storages[0].amount <= 0 || app.blackout || app.spaceJump) {
            app.wPressed = false;
            app.sPressed = false;
            app.aPressed = false;
            app.dPressed = false;
    
            let xVelocity = this.engines[0].speed * Math.cos(this.engines[0].angle);
            let yVelocity = this.engines[0].speed * Math.sin(this.engines[0].angle);
    
            this.x += xVelocity * timeDelta;
            this.y += yVelocity * timeDelta;
            return;
        }
    
        if (app.wPressed && this.engines[0].speed < this.engines[0].speedMax) {
            this.engines[0].speed += this.engines[0].acceleration;
            this.storages[0].amount -= 1 * timeDelta;
        }
        if (app.sPressed && this.engines[0].speed > 0) {
            this.engines[0].speed -= this.engines[0].acceleration;
            this.storages[0].amount -= 1 * timeDelta;
        }
        if (!this.engines[0].angle)
            this.engines[0].angle = 0;
    
        let angleSpeedMod = (this.engines[0].speed / this.engines[0].speedMax - 1) * -1;
        if (angleSpeedMod < 0.1)
            angleSpeedMod = 0.1;
    
        if (app.aPressed) {
            if ((this.engines[0].angle - angleSpeedMod) < (Math.PI * -1))
                this.engines[0].angle = Math.PI;
            else
                this.engines[0].angle -= angleSpeedMod * timeDelta * 5;
    
            this.storages[0].amount -= 1  * timeDelta;
        }
        if (app.dPressed) {
            if ((this.engines[0].angle + angleSpeedMod) > Math.PI)
                this.engines[0].angle = Math.PI * -1;
            else
                this.engines[0].angle += angleSpeedMod * timeDelta * 5;
    
            this.storages[0].amount -= 1 * timeDelta;
        }
    
        let xVelocity = this.engines[0].speed * Math.cos(this.engines[0].angle);
        let yVelocity = this.engines[0].speed * Math.sin(this.engines[0].angle);
    
        this.x += xVelocity * timeDelta;
        this.y += yVelocity * timeDelta;
    }

    checkCollisions() {
        if (app.map.activeChunk) {
            var collidedObjects = Chunk.getClosestObjects(app.map.activeChunk).filter(object => this.checkCollision(object.r, object.x, object.y) && object.name !== 'Nebula');
    
            if (collidedObjects.length > 0) {
    
                if (collidedObjects[0].name === 'Wormhole' && collidedObjects[0].partner) {
                    this.x = collidedObjects[0].partner.x + collidedObjects[0].partner.r + 30;
                    this.y = collidedObjects[0].partner.y + collidedObjects[0].partner.r + 30;
                    this.engines[0].angle = randomNumBetween(Math.PI, -Math.PI);
                }
                else {
                    alert('You collided with an astronomical entity and got smashed to bits in the process.');
                    this.checkCollisions = function(){};
                    Renderer = undefined;
                    location.reload();
                }
            }
        }
    }

    checkCollision(r, x, y) {
        return distance(x, y, this.x, this.y) <= r + this.r;
    }

    scan(astrobject, depth) {
        return astrobject.slice(0, depth);
    }

    store(commodity) {

        var storages = this.storages.filter(function(storage) {
            return storage.type === commodity.type && storage.capacity !== storage.amount;
        });
    
        for (var i = 0; i < storages.length; i++) {
            var storage = storages[i];
            if (storage.capacity >= (storage.amount + commodity.amount)) {
                storage.amount += commodity.amount;
                commodity.amount = 0;
                storage.refreshUI();
                break;
            }
            else if (storage.capacity < (storage.amount + commodity.amount)) {
                storage.amount = storage.capacity;
                commodity.amount = storage.amount + commodity.amount - storage.capacity;
                storage.refreshUI();
            }
        }
    
        if (commodity.amount > 0)
            console.info('storage amount reached for type ' + type);
    }
}

// export default Ship;