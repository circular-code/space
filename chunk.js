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
            {
                let planetAmount = randomNumBetween(this.size/40, this.size/80);
                while (planetAmount) {

                    let planetRadius = randomNumBetween(20 * this.scale, 10 * this.scale);
                    let planetX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let planetY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(planetRadius, planetX, planetY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        planetAmount++;
                    else
                        this.allAstronomicalObjects.push(new Planet (planetRadius, planetX, planetY, this));

                    planetAmount--;
                }

                var starsAmount = randomNumBetween(this.size/160, this.size/320);
                while (starsAmount) {

                    let starRadius = randomNumBetween(100 * this.scale, 20 * this.scale);
                    let starX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let starY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(starRadius, starX, starY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        starsAmount++;
                    else
                        this.allAstronomicalObjects.push(new Star(starRadius,starX,starY));

                    starsAmount--;
                }
            }
            break;

        case 'planets':
            {
                let planetAmount = randomNumBetween(this.size/40, this.size/80);
                while (planetAmount) {

                    let planetRadius = randomNumBetween(20 * this.scale, 10 * this.scale);
                    let planetX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let planetY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(planetRadius, planetX, planetY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        planetAmount++;
                    else
                        this.allAstronomicalObjects.push(new Planet (planetRadius, planetX, planetY, this));

                    planetAmount--;
                }
            }
            break;
        case "stars":
            {
                let starsAmount = randomNumBetween(this.size/320, this.size/640);
                while (starsAmount) {

                    let starRadius = randomNumBetween(100 * this.scale, 20 * this.scale);
                    let starX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let starY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(starRadius, starX, starY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        starsAmount++;
                    else
                        this.allAstronomicalObjects.push(new Star(starRadius,starX,starY));

                    starsAmount--;
                }
        }
            break;

        case "asteroidfield":
            {
                let starsAmount = randomNumBetween(5, 2);

                while (starsAmount) {

                    let starRadius = randomNumBetween(100 * this.scale, 20 * this.scale);
                    let starX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let starY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(starRadius, starX, starY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        starsAmount++;
                    else
                        this.allAstronomicalObjects.push(new Star(starRadius,starX,starY));

                    starsAmount--;
                }

                var asteroidsAmount = randomNumBetween(this.size/10, this.size/20);
                while (asteroidsAmount) {

                    let asteroidRadius = randomNumBetween(15 * this.scale/2, 7 * this.scale/2);
                    let asteroidX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let asteroidY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(asteroidRadius, asteroidX, asteroidY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        asteroidsAmount++;
                    else
                        this.allAstronomicalObjects.push(new Asteroid(asteroidRadius,asteroidX,asteroidY));

                    asteroidsAmount--;
                }
            }
            break;

        case "nebula":
            {
                let starsAmount = randomNumBetween(this.size/160, this.size/320);

                while (starsAmount) {

                    let starRadius = randomNumBetween(100 * this.scale, 20 * this.scale);
                    let starX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let starY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(starRadius,starX, starY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        starsAmount++;
                    else
                        this.allAstronomicalObjects.push(new Star(starRadius,starX,starY));

                    starsAmount--;
                }

                this.allAstronomicalObjects.push(
                    new Nebula(
                        randomNumBetween(700 * this.scale, 600 * this.scale),
                        randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                        randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                    )
                );
            }
            break;

        case "wormhole":
            {
                let starsAmount = randomNumBetween(this.size/160, this.size/320);

                while (starsAmount) {

                    let starRadius = randomNumBetween(100 * this.scale, 20 * this.scale);
                    let starX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                    let starY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);

                    let collided = false;

                    for (let i = 0; i < this.allAstronomicalObjects.length; i++)
                        if (this.allAstronomicalObjects[i].type !== 'nebula')
                            if (this.allAstronomicalObjects[i].checkCollision(starRadius,starX, starY)) {
                                collided = true;
                                break;
                            }

                    if (collided)
                        starsAmount++;
                    else
                        this.allAstronomicalObjects.push(new Star(starRadius,starX,starY));

                    starsAmount--;
                }

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

                    var start = new Wormhole(startRadius,startX,startY);

                    if (start.checkCollision(endRadius,endX, endY))
                        collided = true;

                    if (collided)
                        wormholePairAmount++;
                    else {
                        var otherStart = new Wormhole(endRadius,endX,endY,start);

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
    var type = randomNumBetween(2);

    var chunkType = [
        "starsAndPlanets",
        "planets",
        "stars",
        "asteroidfield",
        "void",
        "nebula",
        "wormhole"
    ];

    this.type = chunkType[type];
};

//TODO: add a second layer of stars, to create a feeling of depth, second layer needs to move
Chunk.prototype.generateBackground = function() {
    var bstarAmount = randomNumBetween(this.size/5 * scale, this.size/10 * scale);
    while (bstarAmount) {

        var bgstar =  new BackgroundStar(
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