'use strict';
function Viewport (x,y) {
    this.x = x;
    this.y = y;
}

Viewport.prototype.focus = function() {
    this.x = ship.x - canvas.width / 2 + ship.r / 2;
    this.y = ship.y - canvas.height / 2 + ship.r / 2;
};

Viewport.prototype.isInside = function(x, y) {
    return x > this.x - 700 && x < (this.x + canvas.width + 700) && y > this.y - 700 && y < (this.y + canvas.height + 700);
};