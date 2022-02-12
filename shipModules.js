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

// TODO: aggregatszustand, temperaturbereich

class StorageModule {
    constructor(objectData, level, builtin, aggregateState, amount, capacity, tempMin, tempMax, domUnits) {
        if (objectData) {
            level = objectData.level;
            builtin = objectData.builtin;
            aggregateState = objectData.aggregateState;
            amount = objectData.amount;
            capacity = objectData.capacity;
            tempMin = objectData.tempMin;
            tempMax = objectData.tempMax;
            domUnits = objectData.domUnits;
        }

        if (!level || typeof level !== 'number' || level <= 0 || level > 3) {
            level = 1;
            console.error('Invalid value for level given. Level set to 1');
        }

        if (typeof builtin !== 'boolean')
            builtin = true;
            console.error('Invalid value for builtin given. builtin set to true');

        super("storage", level, builtin);
        this.aggregateState = aggregateState || "solid";
        this.amount = amount || 0;
        this.capacity = capacity || 0;
        this.tempMin = tempMin || 0;
        this.tempMax = tempMax || 0;
        this.domUnits = domUnits || undefined;
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