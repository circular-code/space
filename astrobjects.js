'use strict';
// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void

function Astrobject(r, x, y) {
    this.r = r;
    this.x = x;
    this.y = y;
    this.color = '#0000ff';
    this.name = 'Astrobject';
}

Astrobject.prototype.checkCollision = function(r, x, y) {
    return distance(x, y, this.x, this.y) <= r + this.r;
};

function Star(loaded, r, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, r, x, y);
    this.color = '#' + randomNumBetween(230,200,true) + randomNumBetween(230,100,true) + randomNumBetween(230,0,true);
    this.range = this.r + randomNumBetween(50,30);
    this.name = 'Star';
}

Star.prototype = Object.create(Astrobject.prototype);
Star.prototype.constructor = Astrobject;

function Planet(loaded, r, x, y, chunk) {

    if (loaded)
        return this;

    Astrobject.call(this, r, x, y);
    this.resources = [];
    this.name = 'Planet';

    var pType = getType("planet");
    var pSType = getType("giantPlanet");

    this.planetType = pType;
    this.planetSubType = pSType;

    var hasBelt = this.hasBelt = !randomNumBetween(9);
    if (hasBelt) {
        this.beltRadius = r + randomNumBetween(30,20);
        this.beltColor = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
        this.beltWidth = randomNumBetween(15,10);
    }

    var hasMoon = this.hasMoon = !randomNumBetween(5);
    if (hasMoon) {
        let chance = randomNumBetween(9);
        let chanceList = [1,1,1,1,2,2,2,3,4,5];
        let amount = chanceList[chance];

        while (amount) {
            new Moon(undefined, this, chunk);
            amount--;
        }
    }

    var hasTradingPost = this.hasTradingPost = !randomNumBetween(9);
    if (hasTradingPost) {
        let amount = 1;

        while (amount) {
            new TradingPost(undefined, this, chunk);
            amount--;
        }
    }

    var hasShipYard = this.hasShipYard = !randomNumBetween(9);
    if (hasShipYard) {
        let amount = 1;

        while (amount) {
            new ShipYard(undefined, this, chunk);
            amount--;
        }
    }

    this.resourceRanges = [];
    var restRange = r - 10;
    for (let i = 0; i < r/10; i++) {
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

            this.range = this.r + randomNumBetween(50,30);

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

function Nebula(loaded, r, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, r, x, y);
    this.color = '#' + randomNumBetween(70,0,true) + randomNumBetween(200,100,true) + randomNumBetween(255, 160,true);
    this.nebulaType = getType("nebula");
    this.name = 'Nebula';
}

Nebula.prototype = Object.create(Astrobject.prototype);
Nebula.prototype.constructor = Astrobject;

function Asteroid(loaded, r, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, r, x, y);
    this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
    this.name = 'Asteroid';
}

Asteroid.prototype = Object.create(Astrobject.prototype);
Asteroid.prototype.constructor = Astrobject;

function Wormhole(loaded, r, x, y, partner) {

    if (loaded)
        return this;

    Astrobject.call(this, r, x, y);
    this.color = '#' + randomNumBetween(200,130,true) + randomNumBetween(10,0,true) + randomNumBetween(200, 130,true);
    this.range = this.r + randomNumBetween(50,30);
    this.name = 'Wormhole';

    if (partner) {
        this.partner = {
            x: partner.x,
            y: partner.y,
            r: partner.r
        };
        partner.partner = {
            x: this.x,
            y: this.y,
            r: this.r
        };
    }
}

Wormhole.prototype = Object.create(Astrobject.prototype);
Wormhole.prototype.constructor = Astrobject;

//TODO: refactor trading posts, moons and shipyards into one function?
function Moon(loaded, planet, chunk) {

    if (loaded)
        return this;

    // can not reference planet because it creates a circular structure so it cant be converted to json, if origin is necessary later on, implement an referencing id
    // this.origin = planet;
    this.originX = planet.x;
    this.originY = planet.y;
    this.extRadius = planet.r + planet.r / 2 + randomNumBetween(60,10);

    var moonCollided = true;

    while (moonCollided) {

        this.angle = randomNumBetween(Math.PI * 10, Math.PI * -10)/10;
        this.r = planet.r * (randomNumBetween(5,1)/10);

        this.x = planet.x + this.extRadius * Math.cos(this.angle);
        this.y = planet.y + this.extRadius * Math.sin(this.angle);

        var all = chunk.allAstrobjects;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(this.r, this.x, this.y)) {
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

    Astrobject.call(this, this.r, this.x, this.y);

    var chance = randomNumBetween(3);
    var chanceList = ['#eeeeee', '#eeeeee', '#ee5533', '#ee3355'];

    this.color = chanceList[chance];
    this.name = 'Moon';

    chunk.allAstrobjects.push(this);
}

Moon.prototype = Object.create(Astrobject.prototype);
Moon.prototype.constructor = Astrobject;

function TradingPost(loaded, planet, chunk) {

    if (loaded)
        return this;

    // can not reference planet because it creates a circular structure so it cant be converted to json, if origin is necessary later on, implement an referencing id
    // this.origin = planet;
    this.originX = planet.x;
    this.originY = planet.y;
    this.extRadius = planet.r + planet.r / 2 + randomNumBetween(60,10);

    var postCollided = true;

    while (postCollided) {

        this.angle = randomNumBetween(Math.PI * 10, Math.PI * -10)/10;
        this.r = planet.r * (randomNumBetween(5,1)/10);

        this.x = planet.x + this.extRadius * Math.cos(this.angle);
        this.y = planet.y + this.extRadius * Math.sin(this.angle);

        var all = chunk.allAstrobjects;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(this.r, this.x, this.y)) {
                    postCollided = true;
                    break;
                }

                postCollided = false;
            }
            else {
                postCollided = false;
            }
        }

        if (all.length === 0)
            postCollided = false;
    }

    Astrobject.call(this, this.r, this.x, this.y);

    this.color = 'purple';
    this.name = 'TradingPost';

    chunk.allAstrobjects.push(this);
}

TradingPost.prototype = Object.create(Astrobject.prototype);
TradingPost.prototype.constructor = Astrobject;

function ShipYard(loaded, planet, chunk) {

    if (loaded)
        return this;

    // can not reference planet because it creates a circular structure so it cant be converted to json, if origin is necessary later on, implement an referencing id
    // this.origin = planet;
    this.originX = planet.x;
    this.originY = planet.y;
    this.extRadius = planet.r + planet.r / 2 + randomNumBetween(60,10);

    var postCollided = true;

    while (postCollided) {

        this.angle = randomNumBetween(Math.PI * 10, Math.PI * -10)/10;
        this.r = planet.r * (randomNumBetween(5,1)/10);

        this.x = planet.x + this.extRadius * Math.cos(this.angle);
        this.y = planet.y + this.extRadius * Math.sin(this.angle);

        var all = chunk.allAstrobjects;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(this.r, this.x, this.y)) {
                    postCollided = true;
                    break;
                }

                postCollided = false;
            }
            else {
                postCollided = false;
            }
        }

        if (all.length === 0)
            postCollided = false;
    }

    Astrobject.call(this, this.r, this.x, this.y);

    this.color = 'yellow';
    this.name = 'ShipYard';

    chunk.allAstrobjects.push(this);
}

ShipYard.prototype = Object.create(Astrobject.prototype);
ShipYard.prototype.constructor = Astrobject;

//TODO: Backgroundstars überarbeiten, immer nur für aktuellen Screen + umgebung erstellen, nicht über save speichern
function BackgroundStar(loaded, r, x, y) {

    if (loaded)
        return this;

    Astrobject.call(this, r, x, y);
    this.color = '#' + randomNumBetween(150,100,true) + randomNumBetween(150,100,true) + randomNumBetween(150, 100,true);
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