'use strict';
function Module(level, name, builtin) {
    this.level = level;
    this.name = name; //scanner, storage, engine, battery
    this.builtin = builtin;
}

// yes, this is overriding this kind of storage api access, but I really dont need it and the name is hard to replace.
function Storage(loaded, level, name, builtin, contentType) {

    if (loaded)
        return this;

    Module.call(this, level, name, builtin);
    this.amount = 0;
    this.capacity = 100;
    this.domUnits = undefined;
    // this.manufacturedMaterials = [],
    // this.data = [];

    if (contentType === 'solid' || contentType === 'liquid' || contentType === 'gas' || contentType === 'plasma' || contentType === 'digital')
        this.contentType = contentType;
    else
        console.error('Invalid contentType defined for Storage initialisation.');
}

Storage.prototype = Object.create(Module.prototype);
Storage.prototype.constructor = Module;

Storage.prototype.refresh = function() {
    if (!this.storageUI && userInterface && userInterface.dom)
        this.createUI();

    var elements = this.storageUI.querySelectorAll('.' + this.contentType);

    var num = this.amount / 10;
    for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('active');
            if (i < num)
                elements[i].classList.add('active');
    }
};

Storage.prototype.createUI = function() {

    var storageContainer = document.createElement('div');
    storageContainer.className = 'storage-container-' + this.contentType;

    for (var j = 0; j < 10; j++) {
        var div = document.createElement('div');
        div.classList.add(this.contentType);
        storageContainer.appendChild(div);
    }

    this.storageUI = storageContainer;
    document.getElementById('storage').appendChild(storageContainer);
};

function Engine(level, name, builtin) {
    Module.call(this, level, name, builtin);
    this.speed = 0;
    this.speedMax = 350;
    this.speedMin = 0;
    this.acceleration = 1;
}

Engine.prototype = Object.create(Module.prototype);
Engine.prototype.constructor = Module;

function Battery(level, name, builtin) {
    Module.call(this, level, name, builtin);
    this.amount = 50;
    this.capacity = 50;
}

Battery.prototype = Object.create(Module.prototype);
Battery.prototype.constructor = Module;

function Fueltank(level, name, builtin) {
    Module.call(this, level, name, builtin);
    this.amount = 50;
    this.capacity = 50;
}

Fueltank.prototype = Object.create(Module.prototype);
Fueltank.prototype.constructor = Module;