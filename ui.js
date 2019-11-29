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

        for (var i = 0; i < ship.storages.length; i++) {

            var storage = ship.storages[i];

            var storageContainer = document.createElement('div');
            storageContainer.className = 'storage-container-' + storage.contentType;

            for (var j = 0; j < 10; j++) {
                var div = document.createElement('div');
                div.classList.add(storage.contentType);
                storageContainer.appendChild(div);
            }

            container.appendChild(storageContainer);
        }
        return container;
    }

    return ui;
})();

