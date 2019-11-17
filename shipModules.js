function Module(level, type, builtin) {
    this.level = level;
    this.type = type; //scanner, storage, engine, batteries
    this.builtin = builtin;
}

// yes, this is overriding storage api, but I really dont need this kind of access and the name is hard to replace.
function Storage(level, type, builtin, storageType) {
    Module.call(this, level, type, builtin);
    this.amount = 0;
    this.size = size;

    if (storageType === 'solid' || storageType === 'liquid' || storageType === 'gas' || storageType === 'plasma')
        this.storageType = storageType;
    else
        console.error('Invalid storage type defined for Storage initialisation.');
    // this.manufacturedMaterials = [],
    // this.data = [];
}

Storage.prototype = Object.create(Module.prototype);
Storage.prototype.constructor = Module;

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