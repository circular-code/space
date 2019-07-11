function Ship (params) {
    // this.width = params.width;
    // this.height = params.height;
    this.radius = params.radius;
    this.x = params.x;
    this.y = params.y;
    this.speed = params.speed;
    this.energy = params.energy;
    this.energyCapacity = 1500;
    this.energyRegenerationAmount = 1;
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
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
};

Ship.prototype.refuelEnergy = function() {
    var ship = this;
    var collidedObjects = map.stars.filter(function(object) {
        return distance(ship.x, ship.y, object.x, object.y) <= ship.radius + object.range;
    });

    if (collidedObjects.length > 0 && this.energyCapacity > (this.energy + this.energyRegenerationAmount)) {
        this.energy += this.energyRegenerationAmount;
    }
};

Ship.prototype.move = function() {

    if (this.energy <= 0) {
        alert('Out of energy you are doomed to drift in the void for eternity.');
        Ship.prototype.move = function(){};
        location.reload();
    }
    else {
        if (this.x < mouseX) {
            if ((this.x + this.speed) > mouseX) {
                this.x = mouseX;
                this.energy -= this.speed;
            }
            else {
                this.x += this.speed;
                this.energy -= this.speed;
            }
        }
        else if (this.x > mouseX) {
            if ((this.x + this.speed) < mouseX) {
                this.x = mouseX;
                this.energy -= this.speed;
            }
            else {
                this.x -= this.speed;
                this.energy -= this.speed;
            }
        }
        if (this.y < mouseY) {
            if ((this.y + this.speed) > mouseY) {
                this.y = mouseY;
                this.energy -= this.speed;
            }
            else {
                this.y += this.speed;
                this.energy -= this.speed;
            }
        }
        else if (this.y > mouseY) {
            if ((this.y + this.speed) < mouseY) {
                this.y = mouseY;
                this.energy -= this.speed;
            }
            else {
                this.y -= this.speed;
                this.energy -= this.speed;
            }
        }
    }
};
Ship.prototype.checkCollision = function() {
    var ship = this;
    var collidedObjects = map.all.filter(function(object) {
        return distance(ship.x, ship.y, object.x, object.y) <= ship.radius + object.radius;
    });

    if (collidedObjects.length > 0) {
        alert('You collided with an astronomical entity and got smashed to bits in the process.');
        Ship.prototype.checkCollision = function(){};
        location.reload();
    }
};