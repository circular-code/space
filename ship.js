function Ship (radius, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.level = 1;
    this.engine = new Engine(1, 1, 'engine', true);
    this.storage = new Storage(1, 1, 'storage', true);
    this.batteries = new Batteries(1, 1, 'batteries', true);
    this.capacity = 5;
}

Ship.prototype.draw = function() {

    //hull
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = "#eeeeee";
    ctx.fill();
    ctx.closePath();

    //energyContainer
    ctx.beginPath();
    ctx.rect(this.x - 15, this.y + 15, 30, 5);
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.closePath();

    //energyAmount
    ctx.beginPath();
    ctx.rect(this.x - 15, this.y + 15, (this.batteries.energy / this.batteries.energyCapacity) * 30, 5);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#00FF00";
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();

    //shield
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI*2);
    ctx.strokeStyle = '#05C7F2';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.globalAlpha = 1;
};

Ship.prototype.checkActiveChunk = function() {
    var activeChunk = map.chunks.filter(function(chunk){
        return chunk.active === true;
    })[0];

    if (activeChunk) {
        // if ship not inside chunk
        if (ship.x < activeChunk.x * activeChunk.size ||
            ship.x > (activeChunk.x * activeChunk.size + activeChunk.size) ||
            ship.y < activeChunk.y * activeChunk.size ||
            ship.y > (activeChunk.y * activeChunk.size + activeChunk.size)) {

            activeChunk.active = false;
            this.checkActiveChunk();
        }
    }
    else {
        activeChunk = map.chunks.filter(function(chunk){
            return ship.x > chunk.x * chunk.size &&
            ship.x < (chunk.x * chunk.size + chunk.size) &&
            ship.y > chunk.y * chunk.size &&
            ship.y < (chunk.y * chunk.size + chunk.size)
        })[0];

        if (activeChunk) {
            activeChunk.active = true;

            if (map.chunks.length > 1)
                map.chunks.splice(map.chunks.indexOf(activeChunk),1);
                
            var swappedChunk = map.chunks.splice(0,1,activeChunk);
            if (swappedChunk[0] !== activeChunk) {
                map.chunks.push(swappedChunk[0]);
            }
            map.generateChunksAroundChunk(activeChunk.x, activeChunk.y);
        }
        else {
            console.error('ship out of bounds');
        }
    }
}

Ship.prototype.refuelEnergy = function() {
    var ship = this;

    var activeChunk = map.chunks.filter(function(chunk){
        return chunk.active === true;
    })[0];

    if (activeChunk) {

        var all = getClosestObjects(activeChunk);

        var collidedObjects = all.filter(function(object) {
            return object.range ? distance(ship.x, ship.y, object.x, object.y) <= ship.radius + object.range : false;
        });

        if (collidedObjects.length > 0 && this.batteries.energyCapacity > (this.batteries.energy + this.batteries.energyRegenerationAmount)) {
            this.batteries.energy += this.batteries.energyRegenerationAmount;
        }
    }
};

//TODO: Ship.prototype.mine wie refuelEnergy

// Mining unterteilen in resource types.
// Unterschiedliche Geräte notwending für unterschiedliche typen
// an Ressourcen je Aggregatszustand?

Ship.prototype.mine = function(resource, amount) {
    Ship.store(resource.retain(amount), resource.name);
}

Ship.prototype.move = function() {

    if (this.batteries.energy <= 0) {
        wPressed = false;
        sPressed = false;
    }

    if (wPressed && this.engine.speed < this.engine.speedMax) {
        this.engine.speed += this.engine.acceleration;
        this.batteries.energy -= 1;
    }
    if (sPressed && this.engine.speed > this.engine.speedMin) {
        this.engine.speed -= this.engine.acceleration;
        this.batteries.energy -= 1;
    }

    if (aPressed) {
        if ((angle - 0.05) < (Math.PI * -1))
            angle = Math.PI;
        else
            angle -= 0.05;

        this.batteries.energy -= 1;
    }
    if (dPressed) {
        if ((angle + 0.05) > Math.PI)
            angle = Math.PI * -1;
        else
            angle += 0.05;

        this.batteries.energy -= 1;
    }

    var xVelocity = this.engine.speed / 100 * Math.cos(angle);
    var yVelocity = this.engine.speed / 100 * Math.sin(angle);

    this.x += xVelocity;
    this.y += yVelocity;
};

Ship.prototype.checkCollision = function() {
    var ship = this;

    var activeChunk = map.chunks.filter(function(chunk){
        return chunk.active === true;
    })[0];

    if (activeChunk) {

        var all = getClosestObjects(activeChunk);

        var collidedObjects = all.filter(function(object) {
            return distance(ship.x, ship.y, object.x, object.y) <= ship.radius + object.radius && object.type !== 'nebula';
        });

        if (collidedObjects.length > 0) {
            alert('You collided with an astronomical entity and got smashed to bits in the process.');
            Ship.prototype.checkCollision = function(){};
            location.reload();
        }
    }
};

Ship.prototype.scan = function(aO, depth) {
    return aO.slice(0, depth);
}

Ship.prototype.store = function(amount, name) {
    var storage = ship.storage[name];

    if (amount === storage.max)
        return console.info('Das Lager für den Typ ' + name + ' ist bereits voll. Es konnten keine weiteren Ressourcen eingelagert werden.');
    else if (storage.max > (storage.amount + amount))
        storage.amount += amount;
    else if (storage.max <= (storage.amount + amount)) {
        storage.amount = storage.max;
        console.info('Lager für ' + name + ' ist nun voll.');
    }
    else
        console.error('Invalid storage amount or max amount.');
}

function getClosestObjects(chunk) {

    var all = chunk.allAstronomicalObjects || [];

    for (var i = 0; i < map.chunks.length; i++) {
        var c = map.chunks[i];
        if ((c.x === chunk.x+1 && c.y === chunk.y-1) ||
            (c.x === chunk.x && c.y === chunk.y-1) ||
            (c.x === chunk.x-1 && c.y === chunk.y-1) ||
            (c.x === chunk.x+1 && c.y === chunk.y) ||
            (c.x === chunk.x-1 && c.y === chunk.y) ||
            (c.x === chunk.x+1 && c.y === chunk.y+1) ||
            (c.x === chunk.x && c.y === chunk.y+1) ||
            (c.x === chunk.x-1 && c.y === chunk.y-1)) {
            all = all.concat(map.chunks[i].allAstronomicalObjects);
        }
    }

    return all;
}