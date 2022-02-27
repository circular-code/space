'use strict';
// Stars, Planets, Dwarf planets, minor planets, exoplanets, brown dwarfs, galaxies, discs, nebulae, void
// https://en.wikipedia.org/wiki/Astronomical_object#Categories_by_location

class Astrobject{
    constructor(r, x, y) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.color = '#0000ff';
        this.name = 'Astrobject';
        this.hasFlag = false;
    }

    checkCollision(r, x, y) {
        return distance(x, y, this.x, this.y) <= r + this.r;
    }
}

class Star extends Astrobject {
    constructor(dataObject, r, x, y) {
        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
            this.color = dataObject.color;
            this.range = dataObject.range;
            this.name = dataObject.name;
        }

        super(r, x, y);
        this.color = '#' + randomNumBetween(230,200,true) + randomNumBetween(230,100,true) + randomNumBetween(230,0,true);
        this.range = this.r + randomNumBetween(50,30) * app.scale;
        this.name = 'Star';
        this.energyRegenerationAmount = 1;
    }
}

class Planet extends Astrobject {
    constructor (dataObject, r, x, y, chunk) {

        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
        }

        super(r, x, y);
        this.resources = [];
        this.name = 'Planet';

        var planetType = getType("planet");
        var planetSubType = getType(planetType);

        this.planetType = planetType;
        this.planetSubType = planetSubType;

        this.hasBelt = !randomNumBetween(9);
        if (this.hasBelt) {
            this.beltRadius = r + randomNumBetween(30,20);
            this.beltColor = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
            this.beltWidth = randomNumBetween(15,10);
        }

        if (!randomNumBetween(5)) {
            this.moons = [];
            let chanceList = [1,1,1,1,2,2,2,3,4,5];
            let amount = chanceList[randomNumBetween(9)];

            while (amount) {
                this.moons.push(new Moon(undefined, this, chunk));
                amount--;
            }
        }

        if (!randomNumBetween(9)) {
            this.tradeposts = [];
            let amount = 1;

            while (amount) {
                this.tradeposts.push(new Tradepost(undefined, this, chunk));
                amount--;
            }
        }

        if (!randomNumBetween(9)) {
            this.shipyards = [];
            let amount = 1;

            while (amount) {
                this.shipyards.push(new Shipyard(undefined, this, chunk));
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

        switch (planetType) {
            case 'giant':

                this.range = this.r + randomNumBetween(50,30);

                switch (planetSubType) {
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
}

class Nebula extends Astrobject {
    constructor(dataObject, r, x, y) {

        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
        }

        super(r, x, y);
        this.color = '#' + randomNumBetween(70,0,true) + randomNumBetween(200,100,true) + randomNumBetween(255, 160,true);
        this.nebulaType = getType("nebula");
        this.name = 'Nebula';
    }
}

class Asteroid extends Astrobject {
    constructor(dataObject, r, x, y) {

        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
        }

        super(r, x, y);
        this.color = '#' + randomNumBetween(170,150,true) + randomNumBetween(170,150,true) + randomNumBetween(170, 150,true);
        this.name = 'Asteroid';
    }
}

class Wormhole extends Astrobject {
    constructor(dataObject, r, x, y, partner) {
        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
        }

        super(r, x, y);
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
}

//TODO: refactor trading posts, moons and Shipyards into one function?
class Moon extends Astrobject {
    constructor(dataObject, planet, chunk) {

        // if (dataObject) {
        //     r = dataObject.r;
        //     x = dataObject.x;
        //     y = dataObject.y;
        // }

        super(0, 0, 0);

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

        var chance = randomNumBetween(3);
        var chanceList = ['#eeeeee', '#eeeeee', '#ee5533', '#ee3355'];

        this.color = chanceList[chance];
        this.name = 'Moon';

        chunk.allAstrobjects.push(this);
    }
}

class Tradepost extends Astrobject {
    constructor(dataObject, planet, chunk) {

        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
        }

        super(0, 0, 0);

        // can not reference planet because it creates a circular structure so it cant be converted to json, if origin is necessary later on, implement an referencing id
        // this.origin = planet;
        this.originX = planet.x;
        this.originY = planet.y;
        this.extRadius = planet.r + planet.r / 2 + randomNumBetween(60,10) * app.scale;

        var postCollided = true;

        while (postCollided) {

            this.angle = randomNumBetween(Math.PI * 10, Math.PI * -10)/10;
            this.r = planet.r * (randomNumBetween(5,1)/10);
            this.range = this.r + 20;

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

        this.color = 'purple';
        this.name = 'Tradepost';
        this.info = {
            title: states[randomNumBetween(states.length)] + ' Outpost',
            system: 'Dalarian 113.14',
            status: 'peaceful',
            allegiance: 'High Order',
            commander: 'Rasmus Skarsgard'
        };
        this.haveResources = [];
        this.needResources = [];
        this.maintenance = [
            new Commodity(false,'Fuel', -1, 'fuel', randomNumBetween(100,1), 'L'),
            new Commodity(false,'Jumpfuel', -1, 'fuel', randomNumBetween(100,1), 'L'),
            new Commodity(false,'Energy', -1, 'other', randomNumBetween(100,1), 'KWH'),
            new Commodity(false,'Repair Service', -1, 'other', randomNumBetween(100,1), 'H')
        ];

        var temp = [];

        for (var index = 0; index < randomNumBetween(32,8); index++) {
            var element = elements[randomNumBetween(elements.length)];
            if (temp.indexOf(element) === -1) {
                temp.push(element);
                //TODO: richtige zustände (solid/fluid/gas/plasma) herausfinden bei X grad
                this.haveResources.push(new Commodity(false, element, randomNumBetween(100,1), 'solid', randomNumBetween(1000,10)));
            }
            else
                index--;
        }

        temp.length = 0;

        for (var index = 0; index < randomNumBetween(32,8); index++) {
            var element = elements[randomNumBetween(elements.length)]
            if (temp.indexOf(element) === -1) {
                temp.push(element);
                //TODO: richtige zustände (solid/fluid/gas/plasma) herausfinden bei X grad
                this.needResources.push(new Commodity(false, element, randomNumBetween(100,1), 'solid', randomNumBetween(1000,10)));
            }
            else
                index--;
        }

        chunk.allAstrobjects.push(this);
    }
}

class Shipyard extends Astrobject {
    constructor(dataObject, planet, chunk) {

        if (dataObject) {
            r = dataObject.r;
            x = dataObject.x;
            y = dataObject.y;
        }

        super(0, 0, 0);
        // can not reference planet because it creates a circular structure so it cant be converted to json, if origin is necessary later on, implement an referencing id
        // this.origin = planet;
        this.originX = planet.x;
        this.originY = planet.y;
        this.extRadius = planet.r + planet.r / 2 + randomNumBetween(60,10);

        var postCollided = true;

        while (postCollided) {

            this.angle = randomNumBetween(Math.PI * 10, Math.PI * -10)/10;
            this.r = planet.r * (randomNumBetween(5,1)/10);
            this.range = this.r + 20;

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

        this.color = 'yellow';
        this.name = 'Shipyard';

        this.maintenance = [
            new Commodity(false,'Fuel', -1, 'fuel', randomNumBetween(100,1), 'L'),
            new Commodity(false,'Jumpfuel', -1, 'fuel', randomNumBetween(100,1), 'L'),
            new Commodity(false,'Energy', -1, 'other', randomNumBetween(100,1), 'KWH'),
            new Commodity(false,'Repair Service', -1, 'other', randomNumBetween(100,1), 'H')
        ];

        chunk.allAstrobjects.push(this);
    }
}

//TODO: Backgroundstars überarbeiten, immer nur für aktuellen Screen + umgebung erstellen, nicht über save speichern
class BackgroundStar extends Astrobject {
    constructor(dataObject, r, x, y) {
        super(r, x, y);
        this.color = '#' + randomNumBetween(150,100,true) + randomNumBetween(150,100,true) + randomNumBetween(150, 100,true);
        this.opacity = randomNumBetween(100);
        this.name = 'BackgroundStar';
    }
}

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
    giant: [
        "gas",
        "ice",
        "solid"
    ]
};