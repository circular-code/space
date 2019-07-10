function Map () {
    this.planets = [];
    this.stars = [];
    this.all = [];
}

Map.prototype.addRandomPlanetsAndStars = function() {
    var planetAmount = randomNumBetween(20,10);
    while (planetAmount) {

        this.planets.push(new Planet(randomNumBetween(20,10),randomNumBetween(canvas.width),randomNumBetween(canvas.height)));
        planetAmount--;
    }

    var starsAmount = randomNumBetween(10,1);
    while (starsAmount) {
        this.stars.push(new Star(randomNumBetween(40,20),randomNumBetween(canvas.width),randomNumBetween(canvas.height)));
        starsAmount--;
    }

    this.all = this.planets.concat(this.stars);
};

Map.prototype.draw = function() {
    for (var i = 0; i< this.all.length; i++) {
        this.all[i].draw();
    }
};