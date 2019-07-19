function Ship (radius, x, y, speed, energy) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.energy = energy;
    this.energyCapacity = 2500;
    this.energyRegenerationAmount = 3;
    this.level = 1;
    this.equipment = {
        predefineModules: {
            storage: {
                level: 1,
                resources: {
                    rawMaterials:[],
                    manufacturedMaterials:[],
                    data:[]
                },
            },
            resourceScanner: {level: 1},
            shield: {level: 1}
        },
        additionalModules: [undefined, undefined, undefined],
    }
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
    ctx.rect(this.x - 15, this.y + 15, (this.energy / this.energyCapacity) * 30, 5);
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

        if (collidedObjects.length > 0 && this.energyCapacity > (this.energy + this.energyRegenerationAmount)) {
            this.energy += this.energyRegenerationAmount;
        }
    }
};

Ship.prototype.move = function() {

    if (this.energy <= 0) {
        alert('Out of energy you are doomed to drift in the void for eternity.');
        Ship.prototype.move = function(){};
        location.reload();
    }
    else {
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        var angle = Math.atan2(dy,dx);

        var xVelocity = this.speed * Math.cos(angle);
        var yVelocity = this.speed * Math.sin(angle);

        this.x += xVelocity;
        this.y += yVelocity;
        if (Math.abs(dx) > 1 && Math.abs(dy) > 1)
            this.energy -= this.speed * 3;
    }
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