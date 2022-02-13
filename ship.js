class Ship {

    constructor(r, x, y, size) {
        var collided = true;
        var xcounter = 0;
        while (collided) {

            collided = this.checkCollisions(app.map.chunks[0], x, y, r);

            if (collided) {
                x = randomNumBetween(size);
                y = randomNumBetween(size);
            }
            else {
                collided = false;
            }
            xcounter++;
            if (xcounter > 100) {
                console.error('Could not generate ship on map. Check map creation values.');
                collided = false;
            }
        }

        this.r = r;
        this.x = x;
        this.y = y;
        this.level = 1;
        this.engine = new EngineModule(undefined, 1, true, 0, 0, 350, 1);
        this.backupEngine = new EngineModule(undefined, 1, true, 0, 0, 350, 1);
        this.backupFuelTank = new StorageModule(undefined, 1, false, 'liquid', 100, 100, -100, 100);
        this.jumptank = new StorageModule(undefined, 1, false, 'liquid', 100, 100, -100, 100);
        this.battery = new StorageModule(undefined, 1, false, 'energy', 100, 100, -100, 100),
        this.storages = [
            new StorageModule(undefined, 1, false, 'solid', 0, 100, -100, 100),
            new StorageModule(undefined, 1, false, 'solid', 0, 100, -100, 100),
            this.backupFuelTank,
            this.jumptank,
            this.battery
        ];
        this.capacity = 5;
        this.credits = 13.37;

        this.storages.forEach(storage => {
            // if (storage.type === 'solid' || storage.type === 'liquid' || storage.type === 'gas' || storage.type === 'plasma')
                // storage.createUI();
        });
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
    
            if (collidedObjects.length > 0 && this.battery.capacity > (this.battery.amount + Star.energyRegenerationAmount)) {
                this.battery.amount += Star.energyRegenerationAmount * timeDelta * collidedObjects.length;
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

        if (this.battery.amount <= 0 || app.blackout || app.spaceJump) {
            app.wPressed = false;
            app.sPressed = false;
            app.aPressed = false;
            app.dPressed = false;
    
            let xVelocity = this.engine.speed * Math.cos(this.engine.angle);
            let yVelocity = this.engine.speed * Math.sin(this.engine.angle);
    
            this.x += xVelocity * timeDelta;
            this.y += yVelocity * timeDelta;
            return;
        }
    
        if (app.wPressed && this.engine.speed < this.engine.speedMax) {
            this.engine.speed += this.engine.acceleration;
            this.battery.amount -= 1 * timeDelta;
        }
        if (app.sPressed && this.engine.speed > 0) {
            this.engine.speed -= this.engine.acceleration;
            this.battery.amount -= 1 * timeDelta;
        }
        if (!this.engine.angle)
            this.engine.angle = 0;
    
        let angleSpeedMod = (this.engine.speed / this.engine.speedMax - 1) * -1;
        if (angleSpeedMod < 0.1)
            angleSpeedMod = 0.1;
    
        if (app.aPressed) {
            if ((this.engine.angle - angleSpeedMod) < (Math.PI * -1))
                this.engine.angle = Math.PI;
            else
                this.engine.angle -= angleSpeedMod * timeDelta * 5;
    
            this.battery.amount -= 1  * timeDelta;
        }
        if (app.dPressed) {
            if ((this.engine.angle + angleSpeedMod) > Math.PI)
                this.engine.angle = Math.PI * -1;
            else
                this.engine.angle += angleSpeedMod * timeDelta * 5;
    
            this.battery.amount -= 1 * timeDelta;
        }
    
        let xVelocity = this.engine.speed * Math.cos(this.engine.angle);
        let yVelocity = this.engine.speed * Math.sin(this.engine.angle);
    
        this.x += xVelocity * timeDelta;
        this.y += yVelocity * timeDelta;
    }

    checkCollisions() {
        var ship = this;
    
        if (app.map.activeChunk) {
    
            var all = Chunk.getClosestObjects(app.map.activeChunk);
    
            var collidedObjects = all.filter(function(object) {
                return distance(ship.x, ship.y, object.x, object.y) <= ship.r + object.r && object.name !== 'Nebula';
            });
    
            if (collidedObjects.length > 0) {
    
                if (collidedObjects[0].name === 'Wormhole' && collidedObjects[0].partner) {
                    ship.x = collidedObjects[0].partner.x + collidedObjects[0].partner.r + 30;
                    ship.y = collidedObjects[0].partner.y + collidedObjects[0].partner.r + 30;
                    ship.engine.angle = randomNumBetween(Math.PI, -Math.PI);
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