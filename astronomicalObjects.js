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
    this.color = '#' + randomNumBetween(255,200,true) + randomNumBetween(255,100,true) + randomNumBetween(200,0,true);
    this.range = this.radius + randomNumBetween(50,30);
    this.type = 'star';
}

Star.prototype = Object.create(AstronomicalObject.prototype);
Star.prototype.constructor = AstronomicalObject;
Star.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {

        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.range/2;

        // hull
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // ranges

        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius + (this.range - this.radius)/2, 0, Math.PI*2);
        // ctx.globalAlpha = 0.1;
        // ctx.fillStyle = this.color;
        // ctx.fill();
        // ctx.closePath();
        // ctx.globalAlpha = 1;


        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
        // ctx.globalAlpha = 0.1;
        // ctx.fillStyle = this.color;
        // ctx.fill();
        // ctx.closePath();
        // ctx.globalAlpha = 1;

        //draw range line
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
}

function Planet(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.type = 'planet';
    this.resources = {};

    var pType = getType("planet");
    var pSType = getType("giantPlanet");

    this.planetType = pType;
    this.planetSubType = pSType;

    var hasBelt = this.hasBelt = !randomNumBetween(9);

    if (hasBelt) {
        this.beltRadius = radius + randomNumBetween(30,20);
        this.beltColor = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
        this.beltWidth = randomNumBetween(15,10);
    }

    switch (pType) {
        case 'giant':

            this.range = this.radius + randomNumBetween(50,30);

            switch (pSType) {
                case 'gas':
                    this.color = '#' + randomNumBetween(235,200,true) + randomNumBetween(210,170,true) + randomNumBetween(185, 150,true);
                    this.resource = new Resource('gas', 'gas', 5000, 0, 10);
                    break;

                case 'ice':
                    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(190,175,true) + randomNumBetween(220, 195,true);
                    this.resource = new Resource('crystal', 'solid', 5000, 0, 10);
                    break;

                case 'solid':
                    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
                    this.resource = new Resource('metal', 'solid', 5000, 0, 10);
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
    this.color = '#' + randomNumBetween(70,0,true) + randomNumBetween(200,100,true) + randomNumBetween(255, 160,true);
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
    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
    this.type = 'asteroid';
}

Asteroid.prototype = Object.create(AstronomicalObject.prototype);
Asteroid.prototype.constructor = AstronomicalObject;


//TODO: Backgroundstars überarbeiten, sprengen save
function BackgroundStar(radius, x, y) {
    AstronomicalObject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(200,0,true) + randomNumBetween(200,0,true) + randomNumBetween(200, 150,true);
    this.type = 'bgstar';
    this.opacity = randomNumBetween(100);
}

BackgroundStar.prototype = Object.create(AstronomicalObject.prototype);
BackgroundStar.prototype.constructor = AstronomicalObject;

BackgroundStar.prototype.draw = function() {
    if (viewport.isInside(this.x, this.y)) {
        ctx.beginPath();
        ctx.globalAlpha = this.opacity/100;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
};

function getType(type) {
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