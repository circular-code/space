function Module(level, size, type) {
    this.level = level;
    this.size = size;
    this.type = type;
}

function Storage() {
    
}

Storage.prototype = Object.create(Module.prototype);
Storage.prototype.constructor = Module;