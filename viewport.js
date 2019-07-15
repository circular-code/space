function Viewport () {
    this.x = 0;
    this.y = 0;
}

Viewport.prototype.focus = function() {
    this.x = ship.x - canvas.width / 2 + ship.radius / 2;
    this.y = ship.y - canvas.height / 2 + ship.radius / 2;
};

Viewport.prototype.isInside = function(x, y) {
    return x > this.x - 700 && x < (this.x + canvas.width + 700) && y > this.y - 700 && y < (this.y + canvas.height + 700);
}

// Viewport.prototype.draw = function() {
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, 30, 0, Math.PI*2);
//     ctx.fillStyle = "#ff0000";
//     ctx.fill();
//     ctx.closePath();

//     ctx.beginPath();
//     ctx.arc(this.x, this.y + canvas.height, 30, 0, Math.PI*2);
//     ctx.fillStyle = "#ff0000";
//     ctx.fill();
//     ctx.closePath();
// }