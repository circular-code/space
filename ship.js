function Ship (params) {
    // this.width = params.width;
    // this.height = params.height;
    this.radius = params.radius;
    this.x = params.x;
    this.y = params.y;
    this.speed = params.speed;
}
Ship.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = "#eeeeee";
    ctx.fill();
    ctx.closePath();
};
Ship.prototype.move = function() {
    if (this.x < mouseX) {
        if ((this.x + this.speed) > mouseX) {
            this.x = mouseX;
        }
        else {
            this.x += this.speed;
        }
    }
    else if (this.x > mouseX) {
        if ((this.x + this.speed) < mouseX) {
            this.x = mouseX;
        }
        else {
            this.x -= this.speed;
        }
    }
    if (this.y < mouseY) {
        if ((this.y + this.speed) > mouseY) {
            this.y = mouseY;
        }
        else {
            this.y += this.speed;
        }
    }
    else if (this.y > mouseY) {
        if ((this.y + this.speed) < mouseY) {
            this.y = mouseY;
        }
        else {
            this.y -= this.speed;
        }
    }
};
Ship.prototype.checkCollision = function() {
    var collidedObjects = map.all.filter(function(object) {
        return distance(this.x, this.y, object.x, object.y) <= this.radius + object.radius;
    });

    if (collidedObjects.length > 0)
        return collidedObjects;
};