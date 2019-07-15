// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void

function AstronomicalObject(radius, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = '#0000ff';
}

// Draw instance on the screen
AstronomicalObject.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};

AstronomicalObject.prototype.checkCollision = function(radius, x, y) {
    return distance(x, y, this.x, this.y) <= radius + this.radius;
}

function Star(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = 'rgba(' + randomNumBetween(255,200) +',' + randomNumBetween(255,200) + ',' + randomNumBetween(130) + ', 1)';
    this.range = this.radius + randomNumBetween(40,10);
    this.type = 'star';
}

Star.prototype = Object.create(AstronomicalObject.prototype);
Star.prototype.constructor = AstronomicalObject;
Star.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {

        // hull
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // range
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
}

function Planet(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = 'rgba(' + randomNumBetween(70) +',' + randomNumBetween(200,100) + ',' + randomNumBetween(255, 160) + ', 1)';
    this.type = 'planet';
}

Planet.prototype = Object.create(AstronomicalObject.prototype);
Planet.prototype.constructor = AstronomicalObject;

function Nebula(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = 'rgba(' + randomNumBetween(70) +',' + randomNumBetween(200,100) + ',' + randomNumBetween(255, 160) + ', 1)';
    this.type = 'nebula';

    var type = randomNumBetween(3);

    var nebulaType = [
        "emission",
        "reflection",
        "dark",
        "supernova",
    ]

    this.nebulaType = nebulaType[type];
}

Nebula.prototype = Object.create(AstronomicalObject.prototype);
Nebula.prototype.constructor = AstronomicalObject;
Nebula.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {


        switch (this.nebulaType) {
            case 'emission':
                ctx.beginPath();
                var innerRadius = this.radius/4;
                var outerRadius = this.radius;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.2;

                var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
                gradient.addColorStop(0, 'purple');
                gradient.addColorStop(0.3, 'blue');
                gradient.addColorStop(0.4, 'green');
                gradient.addColorStop(0.5, 'orange');
                gradient.addColorStop(0.8, '#652323');
                gradient.addColorStop(1, '#000000');

                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;
                break;

            case 'reflection':
                ctx.beginPath();
                var innerRadius = this.radius/3;
                var outerRadius = this.radius;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.3;

                var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
                gradient.addColorStop(0, '#51FFD6');
                gradient.addColorStop(1, 'white');

                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;
                break;

            case 'dark':
                ctx.beginPath();
                var innerRadius = this.radius/3;
                var outerRadius = this.radius;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.3;

                var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
                gradient.addColorStop(0, '#582335');
                gradient.addColorStop(0.3, '#6F274C');
                gradient.addColorStop(0.6, '#652323');
                gradient.addColorStop(1, '#000000');

                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;
                break;

            case 'supernova':
                ctx.beginPath();
                var innerRadius = this.radius/4;
                var outerRadius = this.radius/2;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.3;

                var gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(0.3, 'purple');
                gradient.addColorStop(0.6, 'white');
                gradient.addColorStop(1, 'purple');

                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.closePath();
                ctx.globalAlpha = 1;
                break;
        }
    }
}

function Asteroid(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = '#A1A4A6';
    this.type = 'asteroid';
}

Asteroid.prototype = Object.create(AstronomicalObject.prototype);
Asteroid.prototype.constructor = AstronomicalObject;
