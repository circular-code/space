'use strict';
class Module {

    static validModuleTypes = {
        "scanner": true,
        "storage": true,
        "engine": true,
        "battery": true,
    }

    constructor (moduleType, level, builtin) {
        if (!Module.validModuleTypes[moduleType])
            throw new Error("Invalid module type given to module constructor.");
            
        this.moduleType = moduleType;
        this.level = level;
        this.builtin = builtin;
    }
}

// TODO: aufbereiten sodass dies per Object.values(storage) aufgerufen werden kann

class StorageModule {
    constructor(level, builtin, type, amount) {
        
        super("storage", level, builtin);
        this.amount = amount || 0;
        this.capacity = 100;
        this.domUnits = undefined;
        this.type = type;
    }
 
    refreshUI() {
        if (!this.storageUI && userInterface && userInterface.dom)
            this.createUI();
    
        var elements = this.storageUI.querySelectorAll('.' + this.type);
    
        var num = this.amount / 10;
        for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('active');
                if (i < num)
                    elements[i].classList.add('active');
        }
    }

    createUI() {
        var storageContainer = document.createElement('div');
        storageContainer.className = 'storage-container-' + this.type;
    
        for (var j = 0; j < 10; j++) {
            var div = document.createElement('div');
            div.classList.add(this.type);
            storageContainer.appendChild(div);
        }
    
        this.storageUI = storageContainer;
        document.getElementById('storage').appendChild(storageContainer);
    };
}

class EngineModule {
    constructor(level, builtin) {
        super("engine", level, builtin);
        this.speed = 0;
        this.speedMax = 350;
        this.speedMin = 0;
        this.acceleration = 1;
    }
}