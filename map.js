function Map () {
    this.chunks = [];
    this.width = 5000;
    this.height = 5000;
    //TODO: calculate width/height based on chunks
}

Map.prototype.generateChunk = function() {
    var chunk = new Chunk();
    chunk.populate();
    return chunk;
};

Map.prototype.addChunks = function(position, ) {
    //TODO do this for multiple chunks, maybe only after player reached edge of current chunk
    this.chunks.push(this.generateChunk());
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