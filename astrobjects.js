'use strict';
// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void

function Astrobject(radius, x, y) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = '#0000ff';
    this.name = 'Astrobject';
}

Astrobject.prototype.checkCollision = function(radius, x, y) {
    return distance(x, y, this.x, this.y) <= radius + this.radius;
};

function Star(loaded, radius, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(230,200,true) + randomNumBetween(230,100,true) + randomNumBetween(230,0,true);
    this.range = this.radius + randomNumBetween(50,30);
    this.name = 'Star';
}

Star.prototype = Object.create(Astrobject.prototype);
Star.prototype.constructor = Astrobject;

function Planet(loaded, radius, x, y, chunk) {

    if (loaded)
        return this;

    Astrobject.call(this, radius, x, y);
    this.resources = [];
    this.name = 'Planet';

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
            new Moon(this, chunk);
            amount--;
        }
    }

    this.resourceRanges = [];
    var restRange = radius - 10;
    for (let i = 0; i < radius/10; i++) {
        if (restRange > 10) {
            this.resourceRanges.push(restRange);
            restRange -= 10;
        }
        else {
            break;
        }
    }

    switch (pType) {
        case 'giant':

            this.range = this.radius + randomNumBetween(50,30);

            switch (pSType) {
                case 'gas':
                    this.color = '#' + randomNumBetween(235,200,true) + randomNumBetween(210,170,true) + randomNumBetween(185, 150,true);
                    this.resources.push(new Resource(undefined, 'gas', 'gas', 5000, 0, this.resourceRanges.length), new Resource(undefined, 'crystal', 'liquid', 5000, 0, this.resourceRanges.length));
                    
                    break;

                case 'ice':
                    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(190,175,true) + randomNumBetween(220, 195,true);
                    this.resources.push(new Resource(undefined, 'crystal', 'liquid', 5000, 0, this.resourceRanges.length), new Resource(undefined, 'metal', 'solid', 5000, 0, this.resourceRanges.length));
                    break;

                case 'solid':
                    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
                    this.resources.push(new Resource(undefined, 'metal', 'solid', 5000, 0, this.resourceRanges.length), new Resource(undefined, 'gas', 'gas', 5000, 0, this.resourceRanges.length));
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

Planet.prototype = Object.create(Astrobject.prototype);
Planet.prototype.constructor = Astrobject;

function Nebula(loaded, radius, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(70,0,true) + randomNumBetween(200,100,true) + randomNumBetween(255, 160,true);
    this.nebulaType = getType("nebula");
    this.name = 'Nebula';
}

Nebula.prototype = Object.create(Astrobject.prototype);
Nebula.prototype.constructor = Astrobject;

function Asteroid(loaded, radius, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
    this.name = 'Asteroid';
}

Asteroid.prototype = Object.create(Astrobject.prototype);
Asteroid.prototype.constructor = Astrobject;

function Wormhole(loaded, radius, x, y, partner) {

    if (loaded)
        return this;

    Astrobject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(200,130,true) + randomNumBetween(10,0,true) + randomNumBetween(200, 130,true);
    this.range = this.radius + randomNumBetween(50,30);
    this.name = 'Wormhole';

    if (partner) {
        this.partner = {
            x: partner.x,
            y: partner.y,
            radius: partner.radius
        };
        partner.partner = {
            x: this.x,
            y: this.y,
            radius: this.radius
        };
    }
}

Wormhole.prototype = Object.create(Astrobject.prototype);
Wormhole.prototype.constructor = Astrobject;

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

        var all = chunk.allAstrobjects;

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

    Astrobject.call(this, this.radius, this.x, this.y);

    var chance = randomNumBetween(3);
    var chanceList = ['#eeeeee', '#eeeeee', '#ee5533', '#ee3355'];

    this.color = chanceList[chance];
    this.name = 'Moon';

    chunk.allAstrobjects.push(this);
}

Moon.prototype = Object.create(Astrobject.prototype);
Moon.prototype.constructor = Astrobject;

//TODO: Backgroundstars überarbeiten, immer nur für aktuellen Screen + umgebung erstellen, nicht über save speichern
function BackgroundStar(loaded, radius, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, radius, x, y);
    this.color = '#' + randomNumBetween(200,0,true) + randomNumBetween(200,0,true) + randomNumBetween(200, 150,true);
    this.opacity = randomNumBetween(100);
    this.name = 'BackgroundStar';
}

BackgroundStar.prototype = Object.create(Astrobject.prototype);
BackgroundStar.prototype.constructor = Astrobject;

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