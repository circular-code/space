var userInterface = (function() {

    var ui = {
        dom:document.getElementById('ui')
    };

    ui.create = function() {
        ui.dom.appendChild(ui.createShip());
        ui.dom.appendChild(ui.createStorage());
    };
    
    ui.createShip = function() {
        var container = document.createElement('div');
        container.id = 'ship';

        return container;
    }
    
    ui.createStorage = function() {
        var container = document.createElement('div');
        container.id = 'storage';

        return container;
    }

    ui.create();

    return ui;
})();

