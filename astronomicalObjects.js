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
    this.color = 'rgba(' + randomNumBetween(255,200) +',' + randomNumBetween(255,100) + ',' + randomNumBetween(200) + ', 1)';
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
    this.type = 'planet';

    var pType = getType("planet");
    var pSType = getType("giantPlanet");

    this.planetType = pType;
    this.planetSubType = pSType;

    var hasBelt = this.hasBelt = !randomNumBetween(9);

    if (hasBelt) {
        this.beltRadius = radius + randomNumBetween(30,20);
        this.beltColor = 'rgba(' + randomNumBetween(170,150) +',' + randomNumBetween(170,150) + ',' + randomNumBetween(170, 150) + ', 1)';
        this.beltWidth = randomNumBetween(15,5);
    }

    switch (pType) {
        case 'giant':

            switch (pSType) {
                case 'gas':
                    this.color = 'rgba(' + randomNumBetween(235,200) +',' + randomNumBetween(210,170) + ',' + randomNumBetween(185, 150) + ', 1)';
                    break;

                case 'ice':
                    this.color = 'rgba(' + randomNumBetween(170,150) +',' + randomNumBetween(190,175) + ',' + randomNumBetween(220, 195) + ', 1)';
                    break;

                case 'solid':
                    this.color = 'rgba(' + randomNumBetween(170,150) +',' + randomNumBetween(170,150) + ',' + randomNumBetween(170, 150) + ', 1)';
                    break;
            }

            break;

        case 'meso':
           
            break;

        case 'mini-neptune':
            
            break;

        case 'planemo':
            
            break;

        case 'planetar':
        
            break;

        case 'super-earth':
            
            break;

        case 'super-jupiter':
            
            break;

        case 'sub-earth':
        
            break;
    }
}

Planet.prototype = Object.create(AstronomicalObject.prototype);
Planet.prototype.constructor = AstronomicalObject;
Planet.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        if (this.hasBelt) {
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.beltRadius, 0, Math.PI*2);
            ctx.strokeStyle = this.beltColor;
            ctx.lineWidth = this.beltWidth;
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 1;
        }
    }
}

function Nebula(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = 'rgba(' + randomNumBetween(70) +',' + randomNumBetween(200,100) + ',' + randomNumBetween(255, 160) + ', 1)';
    this.type = 'nebula';
    this.nebulaType = getType("nebula");
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
    this.color = 'rgba(' + randomNumBetween(170,150) +',' + randomNumBetween(170,150) + ',' + randomNumBetween(170, 150) + ', 1)';
    this.type = 'asteroid';
}

Asteroid.prototype = Object.create(AstronomicalObject.prototype);
Asteroid.prototype.constructor = AstronomicalObject;

function getType(type) {
    console.log(types[type][randomNumBetween(types[type].length)]);
    return types[type][randomNumBetween(types[type].length)];
}

var types = {
    nebula: [
        "emission",
        "reflection",
        "dark",
        "supernova",
    ],
    planet: [
        "giant",
        // "meso",
        // "mini-neptune",
        // "planemo",
        // "planetar",
        // "super-earth",
        // "super-jupiter",
        // "sub-earth"
    ],
    giantPlanet: [
        "gas",
        "ice",
        "solid"
    ]
}