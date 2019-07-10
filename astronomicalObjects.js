// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void

function AstronomicalObject(radius, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
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

function Star(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = '#FFCC33';
}

function Planet(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = '#86C2B4';
}

Star.prototype = Object.create(AstronomicalObject.prototype);
Star.prototype.constructor = AstronomicalObject;
Planet.prototype = Object.create(AstronomicalObject.prototype);
Planet.prototype.constructor = AstronomicalObject;
