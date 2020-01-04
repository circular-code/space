'use strict';
function Map (size, scale) {
    this.chunks = [];
    this.chunkSize = size;
    this.scale = scale;
    this.backgroundStars = [];
    this.flaggedAstrobjects = [];
    this.contextMenuAstrobject = undefined;
}

Map.prototype.generateChunk = function(x, y) {
    var chunk = new Chunk(x, y, this.chunkSize, this.scale);
    chunk.getRandomType();
    chunk.populate();
    return chunk;
};

//TODO: add a second/third layer of stars, to create a feeling of depth, second layer needs to move
Map.prototype.generateBackground = function() {
    var bstarAmount = 60;
    while (bstarAmount) {

        var bgstar =  new BackgroundStar(undefined,
            randomNumBetween(3,1),
            randomNumBetween(canvas.width),
            randomNumBetween(canvas.height)
        );

        this.backgroundStars.push(bgstar);

        bstarAmount--;
    }
};

Map.prototype.generateChunksAroundChunk = function(x,y) {

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

Map.prototype.addChunk = function(x, y) {
    this.chunks.push(this.generateChunk(x, y));
};