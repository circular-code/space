'use strict';
class Map {
    constructor(size, scale) {
        this.chunks = [];
        this.chunkSize = size * scale * scale;
        this.scale = scale;
        this.backgroundStars = [];
        this.flaggedAstrobjects = [];
        this.contextMenuAstrobject = undefined;
        this.addChunk(0,0);
        this.generateBackground();
    }

    generateChunk(x, y) {
        var chunk = new Chunk(x, y, this.chunkSize, this.scale);
        chunk.getRandomType();
        chunk.populate();
        return chunk;
    };

    generateBackground() {
        for (var q = 0; q < 3; q++) {

            this.backgroundStars.push([]);
            var bstarAmount = 60;
            while (bstarAmount) {

                var bgstar =  new BackgroundStar(undefined,
                    randomNumBetween(3,1),
                    randomNumBetween(canvas.width),
                    randomNumBetween(canvas.height)
                );

                this.backgroundStars[q].push(bgstar);

                bstarAmount--;
            }
        }
    };

    generateChunksAroundChunk(x,y) {
        var chunkCoords = [];

        var topLeft = {x: x+1, y: y-1};
        var topMiddle = {x: x, y: y-1};
        var topRight = {x: x-1, y: y-1};
        var leftMiddle = {x: x+1, y: y};
        var rightMiddle = {x: x-1, y: y};
        var bottomLeft = {x: x+1, y: y+1};
        var bottomMiddle = {x: x, y: y+1};
        var bottomRight = {x: x-1, y: y+1};

        chunkCoords.push(topLeft,topMiddle,topRight,leftMiddle,rightMiddle,bottomLeft,bottomMiddle,bottomRight);

        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];
            var j = chunkCoords.length;
            while (j--) {
                if (chunk.x === chunkCoords[j].x && chunk.y === chunkCoords[j].y) {
                    chunkCoords.splice(j,1);
                    break;
                }
            }
        }

        for (var k = 0; k < chunkCoords.length; k++) {
            this.addChunk(chunkCoords[k].x, chunkCoords[k].y);
        }
    };

    addChunk(x, y) {
        this.chunks.push(this.generateChunk(x, y));
    };
}