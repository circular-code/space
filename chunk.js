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
        
        case "void":
    }
}

Chunk.prototype.getRandomType = function() {
    var type = randomNumBetween(3);

    var chunkType = [
        "stars",
        "starsAndPlanets",
        "void",
    ]

    this.type = chunkType[type];
}

Chunk.prototype.draw = function() {
    for (var i = 0; i < this.allAstronomicalObjects.length; i++) {
        this.allAstronomicalObjects[i].draw();
    }
}