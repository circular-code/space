function Viewport () {
    this.x = 0;
    this.y = 0;
}

Viewport.prototype.focus = function() {
    this.x = ship.x - canvas.width / 2 + ship.radius / 2;
    this.y = ship.y - canvas.height / 2 + ship.radius / 2;
};