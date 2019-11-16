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
            var planetAmount = randomNumBetween(this.size/40, this.size/80);
            while (planetAmount) {
                
                var planet =  new Planet(
                    randomNumBetween(20 * this.scale, 10 * this.scale),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                )

                var collided = false;

                for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                    if (this.allAstronomicalObjects[i].type !== 'nebula')
                        if (this.allAstronomicalObjects[i].checkCollision(planet.radius, planet.x, planet.y)) {
                            collided = true;
                            break;
                        }

                if (collided)
                    planetAmount++;        
                else
                    this.allAstronomicalObjects.push(planet);

                planetAmount--;
            }
        
            var starsAmount = randomNumBetween(this.size/160, this.size/320);
            while (starsAmount) {
                
                var star = new Star(
                    randomNumBetween(100 * this.scale, 20 * this.scale),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                );

                var collided = false;

                for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                    if (this.allAstronomicalObjects[i].type !== 'nebula')
                        if (this.allAstronomicalObjects[i].checkCollision(star.radius, star.x, star.y)) {
                            collided = true;
                            break;
                        }

                if (collided)
                    starsAmount++;        
                else
                    this.allAstronomicalObjects.push(star);

                starsAmount--;
            }
            break;

        case "stars":
            var starsAmount = randomNumBetween(this.size/320, this.size/640);
            while (starsAmount) {
                
                var star = new Star(
                    randomNumBetween(100 * this.scale, 20 * this.scale),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                );

                var collided = false;

                for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                    if (this.allAstronomicalObjects[i].type !== 'nebula')
                        if (this.allAstronomicalObjects[i].checkCollision(star.radius, star.x, star.y)) {
                            collided = true;
                            break;
                        }

                if (collided)
                    starsAmount++;        
                else
                    this.allAstronomicalObjects.push(star);

                starsAmount--;
            }
            break;

        case "asteroidfield":

            var starsAmount = randomNumBetween(5, 2);
            
            while (starsAmount) {
                
                var star = new Star(
                    randomNumBetween(100 * this.scale, 20 * this.scale),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                );

                var collided = false;

                for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                    if (this.allAstronomicalObjects[i].type !== 'nebula')
                        if (this.allAstronomicalObjects[i].checkCollision(star.radius, star.x, star.y)) {
                            collided = true;
                            break;
                        }

                if (collided)
                    starsAmount++;        
                else
                    this.allAstronomicalObjects.push(star);

                starsAmount--;
            }

            var asteroidsAmount = randomNumBetween(this.size/10, this.size/20);
            while (asteroidsAmount) {
                
                var asteroid =  new Asteroid(
                    randomNumBetween(15 * this.scale/2, 7 * this.scale/2),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                )

                var collided = false;

                for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                    if (this.allAstronomicalObjects[i].type !== 'nebula')
                        if (this.allAstronomicalObjects[i].checkCollision(asteroid.radius, asteroid.x, asteroid.y)) {
                            collided = true;
                            break;
                        }

                if (collided)
                    asteroidsAmount++;        
                else
                    this.allAstronomicalObjects.push(asteroid);

                asteroidsAmount--;
            }
            break;
        
        case "nebula":
            var starsAmount = randomNumBetween(this.size/160, this.size/320);
            
            while (starsAmount) {
                
                var star = new Star(
                    randomNumBetween(100 * this.scale, 20 * this.scale),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                );

                var collided = false;

                for (var i = 0; i < this.allAstronomicalObjects.length; i++)
                    if (this.allAstronomicalObjects[i].type !== 'nebula')
                        if (this.allAstronomicalObjects[i].checkCollision(star.radius, star.x, star.y)) {
                            collided = true;
                            break;
                        }

                if (collided)
                    starsAmount++;        
                else
                    this.allAstronomicalObjects.push(star);

                starsAmount--;
            }

            this.allAstronomicalObjects.push(
                new Nebula(
                    randomNumBetween(700 * this.scale, 600 * this.scale),
                    randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                    randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                )
            );
            break;

        case "void":
    }
}

Chunk.prototype.getRandomType = function() {
    var type = randomNumBetween(9);

    var chunkType = [
        "stars",
        "stars",
        "starsAndPlanets",
        "starsAndPlanets",
        "starsAndPlanets",
        "asteroidfield",
        "void",
        "nebula",
    ]

    this.type = chunkType[type];
}

//TODO: add a second layer of stars, to create a feeling of depth, second layer needs to move
Chunk.prototype.generateBackground = function() {
    var bstarAmount = randomNumBetween(this.size/10, this.size/20);
    while (bstarAmount) {
        
        var bgstar =  new BackgroundStar(
            randomNumBetween(3,1),
            randomNumBetween(this.size + this.x * this.size, this.x * this.size),
            randomNumBetween(this.size + this.y * this.size, this.y * this.size)
        )

        this.backgroundStars.push(bgstar);

        bstarAmount--;
    }
}

Chunk.prototype.draw = function() {
    for (var j = 0; j < this.backgroundStars.length; j++) {
        this.backgroundStars[j].draw();
    }

    for (var i = 0; i < this.allAstronomicalObjects.length; i++) {
        this.allAstronomicalObjects[i].draw();
    }
}