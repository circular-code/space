'use strict';
function Ship (r, x, y, size) {

    var collided = true;
    var xcounter = 0;
    while (collided) {

        collided = checkAllCollisions(map.chunks[0], x, y, r);

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
    this.engine = new Engine(1, 'engine', true, 0, 30, 0, 1);
    this.movementEnergySource = new Storage(undefined, 1, 'fueltank', true, 'fuel', 100);
    this.jumptank = new Storage(undefined, 1, 'fueltank', true, 'jumpfuel', 100);
    this.battery = new Storage(undefined, 1, 'storage', true, 'other', 100);
    this.storages = [
        new Storage(undefined, 1, 'storage', true, 'solid'),
        new Storage(undefined, 1, 'storage', true, 'solid'),
        new Storage(undefined, 1, 'storage', true, 'liquid'),
        new Storage(undefined, 1, 'storage', true, 'gas'),
        new Storage(undefined, 1, 'storage', true, 'plasma'),
        this.movementEnergySource,
        this.jumptank,
        this.battery
    ];
    this.capacity = 5;
    this.credits = 13.37;

    this.storages.forEach(storage => {
        if (storage.type === 'solid' || storage.type === 'liquid' || storage.type === 'gas' || storage.type === 'plasma')
            storage.createUI();
    });
}

Ship.prototype.checkActiveChunk = function() {

    if (map.activeChunk && map.activeChunk.active === true) {
        // if ship not inside chunk
        if (ship.x < map.activeChunk.x * map.activeChunk.size ||
            ship.x > (map.activeChunk.x * map.activeChunk.size + map.activeChunk.size) ||
            ship.y < map.activeChunk.y * map.activeChunk.size ||
            ship.y > (map.activeChunk.y * map.activeChunk.size + map.activeChunk.size)) {

                map.activeChunk.active = false;
            this.checkActiveChunk();
        }
    }
    else {
        map.activeChunk = map.chunks.filter(function(chunk){
            return ship.x > chunk.x * chunk.size &&
            ship.x < (chunk.x * chunk.size + chunk.size) &&
            ship.y > chunk.y * chunk.size &&
            ship.y < (chunk.y * chunk.size + chunk.size);
        })[0];

        if (map.activeChunk) {
            map.activeChunk.active = true;

            map.generateChunksAroundChunk(map.activeChunk.x, map.activeChunk.y);
        }
        else {
            console.error('ship out of bounds');
        }
    }
};

Ship.prototype.refuelEnergy = function(timeDelta) {
    var ship = this;

    if (map.activeChunk) {

        var all = getClosestObjects(map.activeChunk);

        var collidedObjects = all.filter(function(object) {
            return object.name === 'Star' ? distance(ship.x, ship.y, object.x, object.y) <= ship.r + object.range : false;
        });

        if (collidedObjects.length > 0 && this.battery.capacity > (this.battery.amount + Star.energyRegenerationAmount)) {
            this.battery.amount += Star.energyRegenerationAmount * timeDelta * collidedObjects.length;
        }
    }
};

// Mining unterteilen in resource types.
// Unterschiedliche Geräte notwending für unterschiedliche typen
// an Ressourcen je Aggregatszustand?

Ship.prototype.mine = function(resource, amount) {

    var ship = this;

    if (map.activeChunk) {

        var all = getClosestObjects(map.activeChunk);

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
};

Ship.prototype.move = function(timeDelta) {

    if (this.movementEnergySource.amount <= 0 || blackout || spaceJump) {
        wPressed = false;
        sPressed = false;
        aPressed = false;
        dPressed = false;

        let xVelocity = this.engine.speed * Math.cos(this.engine.angle);
        let yVelocity = this.engine.speed * Math.sin(this.engine.angle);

        this.x += xVelocity * timeDelta;
        this.y += yVelocity * timeDelta;
        return;
    }

    if (wPressed && this.engine.speed < this.engine.speedMax) {
        this.engine.speed += this.engine.acceleration;
        this.movementEnergySource.amount -= 1 * timeDelta;
    }
    if (sPressed && this.engine.speed > this.engine.speedMin) {
        this.engine.speed -= this.engine.acceleration;
        this.movementEnergySource.amount -= 1 * timeDelta;
    }
    if (!this.engine.angle)
        this.engine.angle = 0;

    let angleSpeedMod = (this.engine.speed / this.engine.speedMax - 1) * -1;
    if (angleSpeedMod < 0.1)
        angleSpeedMod = 0.1;

    if (aPressed) {
        if ((this.engine.angle - angleSpeedMod) < (Math.PI * -1))
            this.engine.angle = Math.PI;
        else
            this.engine.angle -= angleSpeedMod * timeDelta * 5;

        this.movementEnergySource.amount -= 1  * timeDelta;
    }
    if (dPressed) {
        if ((this.engine.angle + angleSpeedMod) > Math.PI)
            this.engine.angle = Math.PI * -1;
        else
            this.engine.angle += angleSpeedMod * timeDelta * 5;

        this.movementEnergySource.amount -= 1 * timeDelta;
    }

    let xVelocity = this.engine.speed * Math.cos(this.engine.angle);
    let yVelocity = this.engine.speed * Math.sin(this.engine.angle);

    this.x += xVelocity * timeDelta;
    this.y += yVelocity * timeDelta;
};

Ship.prototype.checkAllCollisions = function() {
    var ship = this;

    if (map.activeChunk) {

        var all = getClosestObjects(map.activeChunk);

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
                Ship.prototype.checkAllCollisions = function(){};
                Renderer = undefined;
                location.reload();
            }
        }
    }
};

Ship.prototype.checkCollision = function(r, x, y) {
    return distance(x, y, this.x, this.y) <= r + this.r;
};

Ship.prototype.scan = function(astrobject, depth) {
    return astrobject.slice(0, depth);
};

Ship.prototype.store = function(commodity) {

    var storages = ship.storages.filter(function(storage) {
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
        alert('storage amount reached for type ' + type);
};


