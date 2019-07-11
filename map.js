function Map () {
    this.planets = [];
    this.stars = [];
    this.all = [];
    this.width = 6000;
    this.height = 6000;
}

Map.prototype.addRandomPlanetsAndStars = function() {
    var planetAmount = randomNumBetween(300,100);
    while (planetAmount) {

        this.planets.push(new Planet(randomNumBetween(20,10),randomNumBetween(this.width),randomNumBetween(this.height)));
        planetAmount--;
    }

    var starsAmount = randomNumBetween(100,50);
    while (starsAmount) {
        this.stars.push(new Star(randomNumBetween(40,20),randomNumBetween(this.width),randomNumBetween(this.height)));
        starsAmount--;
    }

    this.all = this.planets.concat(this.stars);
};

Map.prototype.draw = function() {
    for (var i = 0; i< this.all.length; i++) {
        this.all[i].draw();
    }

    //draw grid
    for (var x = 0; x <= canvas.width + camera.x; x += 100) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, canvas.height + camera.y);
    }
    for (var y = 0; y <= canvas.height + camera.y; y += 100) {
        ctx.moveTo(0, 0.5 + y);
        ctx.lineTo(canvas.width + camera.x, 0.5 + y);
    }
    ctx.strokeStyle = "rgba(255,255,255,.1)";
    ctx.stroke();
};