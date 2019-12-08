'use strict';
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
};

function Star(loaded, radius, x, y) {

    if (loaded)
        return this;

    AstronomicalObject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(230,200,true) + randomNumBetween(230,100,true) + randomNumBetween(230,0,true);
    this.range = this.radius + randomNumBetween(50,30);
    this.name = 'Star';
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

        //draw range line
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
        ctx.globalAlpha = 0.03;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
};

function Planet(loaded, radius, x, y, chunk) {

    if (loaded)
        return this;

    AstronomicalObject.call(this, radius, x, y);
    this.resources = {};
    this.name = 'Planet';
    this.moons = [];

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

    var hasMoon = this.hasMoon = !randomNumBetween(5);
    if (hasMoon) {
        var chance = randomNumBetween(9);
        var chanceList = [1,1,1,1,2,2,2,3,4,5];
        var amount = chanceList[chance];

        while (amount) {
            this.moons.push(new Moon(this, chunk));
            amount--;
        }
    }

    switch (pType) {
        case 'giant':

            this.range = this.radius + randomNumBetween(50,30);

            switch (pSType) {
                case 'gas':
                    this.color = '#' + randomNumBetween(235,200,true) + randomNumBetween(210,170,true) + randomNumBetween(185, 150,true);
                    this.resource = new Resource(undefined, 'gas', 'gas', 5000, 0, 10);
                    break;

                case 'ice':
                    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(190,175,true) + randomNumBetween(220, 195,true);
                    this.resource = new Resource(undefined, 'crystal', 'liquid', 5000, 0, 10);
                    break;

                case 'solid':
                    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
                    this.resource = new Resource(undefined, 'metal', 'solid', 5000, 0, 10);
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
};

function Nebula(loaded, radius, x, y) {

    if (loaded)
        return this;

    AstronomicalObject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(70,0,true) + randomNumBetween(200,100,true) + randomNumBetween(255, 160,true);
    this.nebulaType = getType("nebula");
    this.name = 'Nebula';
}

Nebula.prototype = Object.create(AstronomicalObject.prototype);
Nebula.prototype.constructor = AstronomicalObject;
Nebula.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {

        var innerRadius, outerRadius, gradient;

        switch (this.nebulaType) {
            case 'emission':
                ctx.beginPath();
                innerRadius = this.radius/4;
                outerRadius = this.radius;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.2;

                gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
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
                innerRadius = this.radius/3;
                outerRadius = this.radius;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.3;

                gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
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
                innerRadius = this.radius/3;
                outerRadius = this.radius;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.3;

                gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
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
                innerRadius = this.radius/4;
                outerRadius = this.radius/2;
                // Radius of the entire circle.
                ctx.globalAlpha = 0.3;

                gradient = ctx.createRadialGradient(this.x, this.y, innerRadius, this.x, this.y, outerRadius);
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
};

function Asteroid(loaded, radius, x, y) {

    if (loaded)
        return this;

    AstronomicalObject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
    this.name = 'Asteroid';
}

Asteroid.prototype = Object.create(AstronomicalObject.prototype);
Asteroid.prototype.constructor = AstronomicalObject;

function Wormhole(loaded, radius, x, y, partner) {

    if (loaded)
        return this;

    AstronomicalObject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(200,130,true) + randomNumBetween(10,0,true) + randomNumBetween(200, 130,true);
    this.range = this.radius + randomNumBetween(50,30);
    this.name = 'Wormhole';

    if (partner) {
        this.partner = partner;
        partner.partner = this;
    }
}

Wormhole.prototype = Object.create(AstronomicalObject.prototype);
Wormhole.prototype.constructor = AstronomicalObject;

Wormhole.prototype.draw = function() {

    if (viewport.isInside(this.x, this.y)) {

        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.range;
        ctx.globalAlpha = 1;

        // hull
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
    }
};

function Moon(loaded, planet, chunk) {

    if (loaded)
        return this;

    // can not reference planet because it creates a circular structure so it cant be converted to json, if origin is necessary later on, implement an referencing id
    // this.origin = planet;
    this.originX = planet.x;
    this.originY = planet.y;
    this.extRadius = planet.radius + planet.radius / 2 + randomNumBetween(60,10);

    var moonCollided = true;

    while (moonCollided) {

        this.angle = randomNumBetween(Math.PI * 10, Math.PI * -10)/10;
        this.radius = planet.radius * (randomNumBetween(5,1)/10);

        this.x = planet.x + this.extRadius * Math.cos(this.angle);
        this.y = planet.y + this.extRadius * Math.sin(this.angle);

        var all = chunk.allAstronomicalObjects;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(this.radius, this.x, this.y)) {
                    moonCollided = true;
                    break;
                }

                moonCollided = false;
            }
            else {
                moonCollided = false;
            }
        }

        if (all.length === 0)
            moonCollided = false;
    }

    AstronomicalObject.call(this, this.radius, this.x, this.y);

    var chance = randomNumBetween(3);
    var chanceList = ['#eeeeee', '#eeeeee', '#ee5533', '#ee3355'];

    this.color = chanceList[chance];
    this.name = 'Moon';

    chunk.allAstronomicalObjects.push(this);
}

Moon.prototype = Object.create(AstronomicalObject.prototype);
Moon.prototype.constructor = AstronomicalObject;

Moon.prototype.draw = function() {
    if (viewport.isInside(this.x, this.y)) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        //draw range line
        ctx.beginPath();
        ctx.arc(this.originX, this.originY, this.extRadius, 0, Math.PI*2);
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
    }
};

//TODO: Backgroundstars überarbeiten, immer nur für aktuellen Screen + umgebung erstellen, nicht über save speichern
function BackgroundStar(loaded, radius, x, y) {

    if (loaded)
        return this;

    AstronomicalObject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(200,0,true) + randomNumBetween(200,0,true) + randomNumBetween(200, 150,true);
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
};