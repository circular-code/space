function Map (size) {
    this.chunks = [];
    this.chunkSize = size;
}

Map.prototype.generateChunk = function(x, y) {
    var chunk = new Chunk(x, y, this.chunkSize);
    chunk.populate();
    return chunk;
};

Map.prototype.generateChunksAroundChunk = function(x,y) {
    this.addChunk(x+1, y+1);
    this.addChunk(x+1, y);
    this.addChunk(x, y+1);
    this.addChunk(x-1, y+1);
    this.addChunk(x-1, y-1);
    this.addChunk(x+1, y-1);
    this.addChunk(x-1, y);
    this.addChunk(x, y-1);
}

Map.prototype.addChunk = function(x, y) {
    this.chunks.push(this.generateChunk(x, y));
};

Map.prototype.draw = function() {
    for (var i = 0; i< this.chunks.length; i++) {
        this.chunks[i].draw();
    }

    //draw grid
    for (var x = 0; x <= canvas.width + viewport.x; x += 100) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, canvas.height + viewport.y);
    }
    for (var y = 0; y <= canvas.height + viewport.y; y += 100) {
        ctx.moveTo(0, 0.5 + y);
        ctx.lineTo(canvas.width + viewport.x, 0.5 + y);
    }
    ctx.strokeStyle = "rgba(255,255,255,.1)";
    ctx.stroke();
};