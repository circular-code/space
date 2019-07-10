function Map () {
    this.planets = [];
    this.stars = [];
    this.all = [];
}

Map.prototype.addRandomPlanetsAndStars = function() {
    var planetAmount = randomNumBetween(10);
    while (planetAmount) {

        this.planets.push(new Planet());
        planetAmount--;
    }

    var starsAmount = randomNumBetween(10);
    while (starsAmount) {
        this.stars.push(new Star());
        starsAmount--;
    }

    this.all = this.planets.concat(this.stars);
};

Map.prototype.draw = function() {
    for (var i = 0; i< this.all.length; i++) {
        this.all[i].draw();
    }
};