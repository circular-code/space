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
    this.color = 'rgba(' + randomNumBetween(255,200) +',' + randomNumBetween(255,200) + ',' + randomNumBetween(130) + ', 1)';
    this.range = this.radius + randomNumBetween(40,10);
}

Star.prototype = Object.create(AstronomicalObject.prototype);
Star.prototype.constructor = AstronomicalObject;

Star.prototype.draw = function() {

    // hull
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // range
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
}

function Planet(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = 'rgba(' + randomNumBetween(70) +',' + randomNumBetween(200,100) + ',' + randomNumBetween(255, 160) + ', 1)';
}

Planet.prototype = Object.create(AstronomicalObject.prototype);
Planet.prototype.constructor = AstronomicalObject;