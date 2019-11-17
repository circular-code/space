function Module(level, size, type, builtin) {
    this.level = level;
    this.size = size;
    this.type = type; //scanner, storage, engine, batteries
    this.builtin = builtin;
}

// storage type?
function Storage(level, size, type, builtin) {
    Module.call(this, level, size, type, builtin);
        this.metal = {
            amount: 0,
            max: 500
        };
        this.crystal = {
            amount: 0,
            max: 500
        };
        this.gas = {
            amount: 0,
            max: 500
        };
    // this.manufacturedMaterials = [],
    // this.data = [];
}

Storage.prototype = Object.create(Module.prototype);
Storage.prototype.constructor = Module;

function Engine(level, size, type, builtin) {
    Module.call(this, level, size, type, builtin);
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