function Map (oldMap, size) {
    this.chunks = (oldMap && oldMap.chunks) || [];
    this.chunkSize = (oldMap && oldMap.chunkSize) || size;
}

Map.prototype.generateChunk = function(x, y) {
    var chunk = new Chunk(x, y, this.chunkSize);
    chunk.getRandomType();
    chunk.populate();
    chunk.generateBackground();
    return chunk;
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
        this.addChunk(chunkCoords[k].x, chunkCoords[k].y)    
    }
}

Map.prototype.addChunk = function(x, y) {
    this.chunks.push(this.generateChunk(x, y));
};

Map.prototype.draw = function() {
    for (var i = 0; i< this.chunks.length; i++) {
        //TODO: re-add methods to chunk objects


// Create an object with methods (probably using a factory
// function or from a class in a real application)
// const counter = {
    // count: 0,
      
    // increment () {
    //   this.count++
    // }
//   }
  
  // Check if there's some state stored in the local
  // storage, and if so, assign it to the counter intance
//   const counterState = localStorage.counterState
  
//   if (counterState) {
    // Object.assign(counter, JSON.parse(counterState))
//   }
  
  // Then somewhere else, do something that modifies state, 
  // and persist it to the local storage
//   counter.increment()
//   localStorage.counterState = JSON.stringify(counter)

        this.chunks[i].draw();
    }

    // draw grid
    // for (var x = 0; x <= canvas.width + viewport.x; x += 100) {
    //     ctx.moveTo(0.5 + x, 0);
    //     ctx.lineTo(0.5 + x, canvas.height + viewport.y);
    // }
    // for (var y = 0; y <= canvas.height + viewport.y; y += 100) {
    //     ctx.moveTo(0, 0.5 + y);
    //     ctx.lineTo(canvas.width + viewport.x, 0.5 + y);
    // }
    // ctx.strokeStyle = "rgba(255,255,255,.1)";
    // ctx.stroke();
};