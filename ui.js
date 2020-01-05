'use strict';
var userInterface = (function() {

    var ui = {
        dom:document.getElementById('ui')
    };

    ui.create = function() {
        ui.dom.appendChild(ui.createShip());
        ui.dom.appendChild(ui.createStorage());
        ui.dom.appendChild(ui.createInfo());
    };

    ui.createShip = function() {
        var container = document.createElement('div');
        container.id = 'ship';

        return container;
    };

    ui.createInfo = function() {
        var container = document.createElement('div');
        container.id = 'info';

        var credits = document.createElement('div');
        credits.id = 'credits';
        this.credits = credits;

        var speed = document.createElement('div');
        speed.id = 'speed';
        this.speed = speed;

        var xCoordinate = document.createElement('div');
        xCoordinate.id = 'xCoordinate';
        this.xCoordinate = xCoordinate;

        var seperator = document.createElement('div');
        seperator.id = 'seperator';
        seperator.textContent = '/';

        var yCoordinate = document.createElement('div');
        yCoordinate.id = 'yCoordinate';
        this.yCoordinate = yCoordinate;

        container.appendChild(xCoordinate);
        container.appendChild(seperator);
        container.appendChild(yCoordinate);
        container.appendChild(speed);
        container.appendChild(credits);

        return container;
    };

    ui.createStorage = function() {
        var container = document.createElement('div');
        container.id = 'storage';

        return container;
    };

    return ui;
})();

