// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void

function AstronomicalObject() {
    this.radius = params.radius;
    this.x = params.x;
    this.y = params.y;
    this.color = '#eeeeee';
}

// Draw instance on the screen
AstronomicalObject.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

function Star(beamRadius) {
    this.beamRadius = beamRadius;
    this.color = '#ff0000';
};

// Inherit from the parent class
Star.prototype = Object.create(AstronomicalObject.prototype);
Star.prototype.constructor = Enemy;