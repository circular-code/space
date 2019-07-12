function Chunk () {
    this.allAstronomicalObjects = [];
    this.width = 2500;
    this.height = 2500;
    //TODO: add some kind of koordinate system to base chunks on.
}

Chunk.prototype.populate = function() {
    var planetAmount = randomNumBetween(300,100);
    while (planetAmount) {

        this.allAstronomicalObjects.push(new Planet(randomNumBetween(20,10),randomNumBetween(this.width),randomNumBetween(this.height)));
        planetAmount--;
    }

    var starsAmount = randomNumBetween(100,50);
    while (starsAmount) {
        this.allAstronomicalObjects.push(new Star(randomNumBetween(40,20),randomNumBetween(this.width),randomNumBetween(this.height)));
        starsAmount--;
    }
}

Chunk.prototype.draw = function() {
    for (var i = 0; i< this.all.length; i++) {
        this.allAstronomicalObjects[i].draw();
    }
}