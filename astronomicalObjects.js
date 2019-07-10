// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void

function AstronomicalObject() {
    this.radius = randomNumBetween(30);
    this.x = randomNumBetween(canvas.width);
    this.y = randomNumBetween(canvas.height);
    this.color = '#0000ff';
}

// Draw instance on the screen
AstronomicalObject.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

function Star() {
    this.color = '#ff0000';
}

function Planet() {
    this.color = '#ff0000';
}

Star.prototype = Object.create(AstronomicalObject.prototype);
Star.prototype.constructor = AstronomicalObject;
Planet.prototype = Object.create(AstronomicalObject.prototype);
Planet.prototype.constructor = AstronomicalObject;
