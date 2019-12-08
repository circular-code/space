'use strict';
var resourceTypes = {
    deuterium: {
        planetTypes: [
            "giant_gas", "giant_ice", "giant_solid", "meso", "miniNeptune", "planemo",
        ],
        depthMin: 1,
        depthMax: 5,
    },
    water: {

    },
    iron: {
        planetTypes: [
            "giant_solid", "meso", "planetar"
        ],
        depthMin: 0,
        depthMax: 9,
    }
};

/*
example: {
    depthMin and Max show on which layer the Resource can occur on a planet, this should be different for each planet type
    qualityMin and Max show how pure the resource is, how long you have to mine in order to get x amount of resource
}*/

/* how many layers can a planet have, how many resource spots will be distributed on the planet? */

function Resource (loaded, name, type, amount, depthMin, depthMax) {

    if (loaded)
        return this;

    // e.g. crystal
    this.name = name;

    // solid, fluid, gas
    this.type = type;

    //positive integer
    this.amount = amount;

    // float between 0 - 1
    this.quality = Math.random();

    // random value inside depth range
    this.depth = randomNumBetween(depthMax, depthMin);

    // depletion flag
    this.depleted = false;
}

Resource.prototype.retain = function (amount) {
    if (typeof amount !== 'number')
        return console.error('Tried to retain resource with invalid amount.');

    if (this.depleted) {
        console.info('Requested resource is depleted.');
        return 0;
    }

    if ((this.amount - amount) > 0) {
        this.amount -= amount;
        return amount;
    }
    else if ((this.amount - amount) <= 0) {
        this.amount = 0;
        this.depleted = true;
        return amount + (this.amount - amount);
    }
};
