'use strict';
class Module {

    #moduleType;
    #level;
    #builtin;

    #validModuleTypes = {
        "scanner": true,
        "storage": true,
        "engine": true,
    }

    constructor (moduleType, level, builtin) {
        this.#setModuleType(moduleType);
        this.#setLevel(level);
        this.#setBuiltin(builtin);
    }

    get moduleType() {
        return this.#moduleType;
    }
    get level() {
        return this.#level;
    }
    get builtin() {
        return this.#builtin;
    }

    #setModuleType(moduleType) {
        if (typeof moduleType !== 'string' || !this.#validModuleTypes[moduleType])
            throw new Error("Invalid moduleType given.");

        this.#moduleType = moduleType;
    }
    #setLevel(level) {
        if (!level || typeof level !== 'number' || level <= 0 || level > 3) {
            console.error('Invalid value for level given. Level set to 1', level);
            level = 1;
        }
        this.#level = level;
    }
    #setBuiltin(builtin) {
        if (typeof builtin !== 'boolean') {
            console.error('Invalid value for builtin given. builtin set to true', builtin);
            builtin = true;
        }
        this.#builtin = builtin;
    }
}

class StorageModule extends Module {

    #validStorageTypes = {
        "solid": true,
        "liquid": true,
        "gas": true,
        "plasma": true,
        "energy": true
    }
    #type;
    #amount;
    #capacity;
    #tempMin;
    #tempMax;
    
    constructor(object, level, builtin, type, amount, capacity, tempMin, tempMax) {

        // enable just throwing old object at constructor to create new object
        if (object) {
            level = object.level;
            builtin = object.builtin;
            type = object.type;
            amount = object.amount;
            capacity = object.capacity;
            tempMin = object.tempMin;
            tempMax = object.tempMax;
        }

        super("storage", level, builtin);

        this.#setType(type);
        this.#setAmount(amount);
        this.#setCapacity(capacity);
        this.#setTempMin(tempMin);
        this.#setTempMax(tempMax);
    }

    get type() {
        return this.#type;
    }
    get amount() {
        return this.#amount;
    }
    get capacity() {
        return this.#capacity;
    }
    get tempMin() {
        return this.#tempMin;
    }
    get tempMax() {
        return this.#tempMax;
    }

    set amount(amount) {
        this.#setAmount(amount);
    }

    #setType(type) {
        if (typeof type !== 'string' || !this.#validStorageTypes[type]) {
            console.error('Invalid value for type given. type set to solid', type);
            type = 'solid';
        }
        this.#type = type;
    }
    #setAmount(amount) {
        if (typeof amount !== 'number' || amount !== amount || amount < 0) {
            console.error('Invalid value for amount given. amount set to 0', amount);
            amount = 0;
        }
        this.#amount = amount;
    }
    #setCapacity(capacity) {
        if (typeof capacity !== 'number' || capacity !== capacity || capacity < 0) {
            console.error('Invalid value for capacity given. capacity set to 0', capacity);
            capacity = 0;
        }
        this.#capacity = capacity;
    }
    #setTempMin(tempMin) {
        if (typeof tempMin !== 'number' || tempMin !== tempMin || tempMin < -273.15) {
            console.error('Invalid value for tempMin given. tempMin set to 0', tempMin);
            tempMin = 0;
        }
        this.#tempMin = tempMin;
    }
    #setTempMax(tempMax) {
        if (typeof tempMax !== 'number' || tempMax !== tempMax || tempMax < -273.15) {
            console.error('Invalid value for tempMax given. tempMax set to 0', tempMax);
            tempMax = 0;
        }
        this.#tempMax = tempMax;
    }
 
    refreshUI() {
        // if (!this.storageUI && userInterface && userInterface.dom)
        //     this.createUI();
    
        // var elements = this.storageUI.querySelectorAll('.' + this.type);
    
        // var num = this.amount / 10;
        // for (var i = 0; i < elements.length; i++) {
        //         elements[i].classList.remove('active');
        //         if (i < num)
        //             elements[i].classList.add('active');
        // }
    }

    createUI() {
        // var storageContainer = document.createElement('div');
        // storageContainer.className = 'storage-container-' + this.type;
    
        // for (var j = 0; j < 10; j++) {
        //     var div = document.createElement('div');
        //     div.classList.add(this.type);
        //     storageContainer.appendChild(div);
        // }
    
        // this.storageUI = storageContainer;
        // document.getElementById('storage').appendChild(storageContainer);
    };
}

class EngineModule extends Module {
    constructor(level, builtin) {
        super("engine", level, builtin);
        this.speed = 0;
        this.speedMax = 350;
        this.speedMin = 0;
        this.acceleration = 1;
    }
}