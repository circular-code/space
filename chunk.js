function Chunk (x, y, size) {
    this.allAstronomicalObjects = [];
    this.size = size;
    this.x = x;
    this.y = y;
    this.active = false;
}

Chunk.prototype.populate = function() {

    switch (this.type) {
        case 'starsAndPlanets': 
            var planetAmount = randomNumBetween(this.size/40, this.size/80);
            while (planetAmount) {
        
                this.allAstronomicalObjects.push(
                    new Planet(
                        randomNumBetween(20,10),
                        randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                        randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                    )
                );
                planetAmount--;
            }
        
            var starsAmount = randomNumBetween(this.size/160, this.size/320);
            while (starsAmount) {
                this.allAstronomicalObjects.push(
                    new Star(
                        randomNumBetween(40,20),
                        randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                        randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                    )
                );
                starsAmount--;
            }
            break;

        case "stars":
            var starsAmount = randomNumBetween(this.size/160, this.size/320);
            while (starsAmount) {
                this.allAstronomicalObjects.push(
                    new Star(
                        randomNumBetween(40,20),
                        randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                        randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                    )
                );
                starsAmount--;
            }
            break;

        case "asteroidfield":

                var starsAmount = randomNumBetween(3, 1);
                while (starsAmount) {
                    this.allAstronomicalObjects.push(
                        new Star(
                            randomNumBetween(40,20),
                            randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                            randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                        )
                    );
                    starsAmount--;
                }

                var asteroidsAmount = randomNumBetween(this.size/10, this.size/20);
                while (asteroidsAmount) {
                    this.allAstronomicalObjects.push(
                        new Asteroid(
                            randomNumBetween(15,7),
                            randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                            randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                        )
                    );
                    asteroidsAmount--;
                }
                break;
        
        case "nebula":
            var starsAmount = randomNumBetween(this.size/160, this.size/320);
            while (starsAmount) {
                this.allAstronomicalObjects.push(
                    new Star(
                        randomNumBetween(40,20),
                        randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                        randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                    )
                );
                starsAmount--;
            }

            this.allAstronomicalObjects.push(
                new Nebula(
                    randomNumBetween(700,600),
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

Chunk.prototype.draw = function() {
    for (var i = 0; i < this.allAstronomicalObjects.length; i++) {
        this.allAstronomicalObjects[i].draw();
    }
}