'use strict';

class Chunk {
    constructor(x, y, size, scale) {
        this.allAstrobjects = [];
        this.size = size;
        this.x = x;
        this.y = y;
        this.active = false;
        this.scale = scale;
    }

    populate() {
        switch (this.type) {
            case 'starsAndPlanets':
                this.createAstrobjects(this, Planet, this.size/40, this.size/80, 20 * this.scale, 10 * this.scale);
                this.createAstrobjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);
                break;
    
            case 'planets':
                this.createAstrobjects(this, Planet, this.size/40, this.size/80, 20 * this.scale, 10 * this.scale);
                break;
            case "stars":
                this.createAstrobjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);
                break;
    
            case "asteroidfield":
                this.createAstrobjects(this, Star, this.size/640, this.size/1280, 100 * this.scale, 20 * this.scale);
                this.createAstrobjects(this, Asteroid, this.size/10, this.size/20, 15 * this.scale/2,  7 * this.scale/2);
                break;
    
            case "nebula":
                this.createAstrobjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);
    
                    this.allAstrobjects.push(
                        new Nebula(undefined,
                            randomNumBetween(700 * this.scale, 600 * this.scale),
                            randomNumBetween(this.size + this.x * this.size, this.x * this.size),
                            randomNumBetween(this.size + this.y * this.size, this.y * this.size)
                        )
                    );
                break;
    
            case "wormhole":
                {
                    this.createAstrobjects(this, Star, this.size/320, this.size/640, 100 * this.scale, 20 * this.scale);
    
                    let wormholePairAmount = 1;
    
                    while (wormholePairAmount) {
    
                        let startRadius = 10 * this.scale;
                        let startX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                        let startY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);
    
                        let endRadius = 10 * this.scale;
                        let endX = randomNumBetween(this.size + this.x * this.size, this.x * this.size);
                        let endY = randomNumBetween(this.size + this.y * this.size, this.y * this.size);
    
                        let collided = false;
    
                        for (let i = 0; i < this.allAstrobjects.length; i++)
                            if (this.allAstrobjects[i].type !== 'nebula')
                                if (this.allAstrobjects[i].checkCollision(startRadius,startX, startY) || this.allAstrobjects[i].checkCollision(endRadius,endX,endY)) {
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
    
                            this.allAstrobjects.push(start, otherStart);
                        }
    
                        wormholePairAmount--;
                    }
                }
                break;
    
            case "void":
        }
    };    

     getRandomType() {
        var type = randomNumBetween(7);
    
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

    
    checkAllCollisions(chunk, x, y, r) {
        var collided = false;
        for (let i = 0; i < chunk.allAstrobjects.length; i++)
            if (chunk.allAstrobjects[i].type !== 'nebula')
                if (chunk.allAstrobjects[i].checkCollision(r, x, y)) {
                    collided = true;
                    break;
                }

        return collided;
    }

    createAstrobjects(chunk, classHolder, amountMax, amountMin, rMax, rMin) {
        let planetAmount = randomNumBetween(amountMax, amountMin);
        while (planetAmount > 0) {
    
            let planetRadius = randomNumBetween(rMax, rMin);
            let planetX = randomNumBetween(chunk.size + chunk.x * chunk.size, chunk.x * chunk.size);
            let planetY = randomNumBetween(chunk.size + chunk.y * chunk.size, chunk.y * chunk.size);
    
            let collided = this.checkAllCollisions(chunk, planetX, planetY, planetRadius);
    
            if (collided)
                planetAmount++;
            else
                chunk.allAstrobjects.push(new classHolder(undefined, planetRadius, planetX, planetY, chunk));
    
            planetAmount--;
        }
    }

    static getClosestObjects(chunk) {

        var all = chunk.allAstrobjects || [];
    
        for (var i = 0; i < app.map.chunks.length; i++) {
            var c = app.map.chunks[i];
            if ((c.x === chunk.x+1 && c.y === chunk.y-1) ||
                (c.x === chunk.x && c.y === chunk.y-1) ||
                (c.x === chunk.x-1 && c.y === chunk.y-1) ||
                (c.x === chunk.x+1 && c.y === chunk.y) ||
                (c.x === chunk.x-1 && c.y === chunk.y) ||
                (c.x === chunk.x+1 && c.y === chunk.y+1) ||
                (c.x === chunk.x && c.y === chunk.y+1) ||
                (c.x === chunk.x-1 && c.y === chunk.y-1)) {
                all = all.concat(app.map.chunks[i].allAstrobjects);
            }
        }
    
        return all;
    }
}