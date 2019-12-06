'use strict';
function Module(level, type, builtin) {
    this.level = level;
    this.type = type; //scanner, storage, engine, batteries
    this.builtin = builtin;
}

// yes, this is overriding this kind of storage api access, but I really dont need it and the name is hard to replace.
function Storage(level, type, builtin, contentType) {
    Module.call(this, level, type, builtin);
    this.amount = 0;
    this.size = 100;
    this.domUnits = undefined;
    // this.manufacturedMaterials = [],
    // this.data = [];

    if (contentType === 'solid' || contentType === 'liquid' || contentType === 'gas' || contentType === 'plasma')
        this.contentType = contentType;
    else
        console.error('Invalid storage type defined for Storage initialisation.');
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
            if (i <= num)
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

function Engine(level, type, builtin) {
    Module.call(this, level, type, builtin);
    this.speed = 0;
    this.speedMax = 350;
    this.speedMin = -50;
    this.acceleration = 1;
}

Engine.prototype = Object.create(Module.prototype);
Engine.prototype.constructor = Module;

//TODO: introduce alternative energies like a fuel tank as starter energy, maybe also a different kind of energy to make "jumps"?
function Batteries(level, size, type, builtin) {
    Module.call(this, level, size, type, builtin);
    this.energy = 50;
    this.energyCapacity = 50;
    this.energyRegenerationAmount = 1;
}

Batteries.prototype = Object.create(Module.prototype);
Batteries.prototype.constructor = Module;

// Shield Generator, Weapons, Cabins, ...