function Camera () {
    this.x = 0;
    this.y = 0;
}

Camera.prototype.focus = function() {
    this.x = this.clamp(ship.x - canvas.width / 2 + ship.radius / 2, 0, map.width - canvas.width);
    this.y = this.clamp(ship.y - canvas.height / 2 + ship.radius / 2, 0, map.height - canvas.height);
};

Camera.prototype.clamp = function(coord, min, max) {
    if (coord < min) {
        return min
    } else if (coord > max) {
        return max
    } else {
        return coord
    }
};