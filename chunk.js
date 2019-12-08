'use strict';

function Chunk (x, y, size, scale) {
    this.allAstronomicalObjects = [];
    this.backgroundStars = [];
    this.size = size;
    this.x = x;
    this.y = y;
    this.active = false;
    this.scale = scale;
}

Chunk.prototype.populate = function() {

    switch (this.type) {
        case 'starsAndPlanets':
                createAstronomicalObjects(this, Planet, this.size/40, this.size/80, 20 * this.scale, 10 * this.scale);
                createAstronomicalObjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);
            break;

        case 'planets':
                createAstronomicalObjects(this, Planet, this.size/40, this.size/80, 20 * this.scale, 10 * this.scale);
            break;
        case "stars":
                createAstronomicalObjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);
            break;

        case "asteroidfield":
                createAstronomicalObjects(this, Star, this.size/640, this.size/1280, 100 * this.scale, 20 * this.scale);
                createAstronomicalObjects(this, Asteroid, this.size/10, this.size/20, 15 * this.scale/2,  7 * this.scale/2);
            break;

        case "nebula":
                createAstronomicalObjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);

                this.allAstronomicalObjects.push(
                    new Nebula(undefined,
                        randomNumBetween(700 * this.scale, 600 * this.scale),
                        randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                        randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                    )
                );
            break;

        case "wormhole":
            {
                createAstronomicalObjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);

                let wormholePairAmount = 1;

                while (wormholePairAmount) {

                    let startRadius = 10 * this.scale;
                    let startX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let startY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let endRadius = 10 * this.scale;
                    let endX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let endY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(startRadius,startX, startY) || this.allAstronomicalObjects[i].checkCollision(endRadius,endX,endY)) {
                                collided = true;
                                break;
                            }

                    var start = new Wormhole(undefined, startRadius,startX,startY);

                    if (start.checkCollision(endRadius,endX, endY))
                        collided = true;

                    if (collided)
                        wormholePairAmount++;
                    else {
                        var otherStart = new Wormhole(undefined, endRadius,endX,endY,start);

                        this.allAstronomicalObjects.push(start, otherStart);
                    }

                    wormholePairAmount--;
                }
            }
            break;

        case "void":
    }
};

Chunk.prototype.getRandomType = function() {
    var type = randomNumBetween(0);

    var chunkType = [
        // "starsAndPlanets",
        // "planets",
        // "stars",
        // "asteroidfield",
        // "void",
        // "nebula",
        "wormhole"
    ];

    this.type = chunkType[type];
};

//TODO: add a second layer of stars, to create a feeling of depth, second layer needs to move
Chunk.prototype.generateBackground = function() {
    var bstarAmount = randomNumBetween(this.size/5 * scale, this.size/10 * scale);
    while (bstarAmount) {

        var bgstar =  new BackgroundStar(undefined,
            randomNumBetween(3,1),
            randomNumBetween(this.size + this.x * this.size, this.x * this.size),
            randomNumBetween(this.size + this.y * this.size, this.y * this.size)
        );

        this.backgroundStars.push(bgstar);

        bstarAmount--;
    }
};

Chunk.prototype.draw = function() {
    for (var j = 0; j < this.backgroundStars.length; j++) {
        this.backgroundStars[j].draw();
    }

    for (var i = 0; i < this.allAstronomicalObjects.length; i++) {
        this.allAstronomicalObjects[i].draw();
    }
};

function checkAllCollisions(chunk, x, y, radius) {
    var collided = false;
    for (let i = 0; i < chunk.allAstronomicalObjects.length; i++)
        if (chunk.allAstronomicalObjects[i].type !== 'nebula')
            if (chunk.allAstronomicalObjects[i].checkCollision(radius, x, y)) {
                collided = true;
                break;
            }

    return collided;
}

function createAstronomicalObjects(chunk, classHolder, amountMax, amountMin, radiusMax, radiusMin) {
    let planetAmount = randomNumBetween(amountMax, amountMin);
    while (planetAmount > 0) {

        let planetRadius = randomNumBetween(radiusMax, radiusMin);
        let planetX = randomNumBetween(chunk.size + chunk.x * chunk.size, chunk.x * chunk.size);
        let planetY = randomNumBetween(chunk.size + chunk.y * chunk.size, chunk.y * chunk.size);

        let collided = checkAllCollisions(chunk, planetX, planetY, planetRadius);

        if (collided)
            planetAmount++;
        else
            chunk.allAstronomicalObjects.push(new classHolder(undefined, planetRadius, planetX, planetY, chunk));

        planetAmount--;
    }
}