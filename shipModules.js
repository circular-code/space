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
        if (typeof level !== 'number' || level !== level || level < 1 || level > 3) {
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
    
    constructor(dataObject, level, builtin, type, amount, capacity, tempMin, tempMax) {

        // enable just throwing old object at constructor to create new object
        if (dataObject) {
            level = dataObject.level;
            builtin = dataObject.builtin;
            type = dataObject.type;
            amount = dataObject.amount;
            capacity = dataObject.capacity;
            tempMin = dataObject.tempMin;
            tempMax = dataObject.tempMax;
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

class EngineModule extends Module {

    #angle;
    #speed;
    #speedMax;
    #acceleration;

    constructor(dataObject, level, builtin, angle, speed, speedMax, acceleration) {

        // enable just throwing old object at constructor to create new object
        if (dataObject) {
            level = dataObject.level;
            builtin = dataObject.builtin;
            angle = dataObject.angle;
            speed = dataObject.speed;
            speedMax = dataObject.speedMax;
            acceleration = dataObject.acceleration;
        }

        super("engine", level, builtin);

        this.#setAngle(angle);
        this.#setSpeed(speed);
        this.#setSpeedMax(speedMax);
        this.#setAcceleration(acceleration);
    }

    get angle() {
        return this.#angle;
    }
    get speed() {
        return this.#speed;
    }
    get speedMax() {
        return this.#speedMax;
    }
    get acceleration() {
        return this.#acceleration;
    }

    set angle(angle) {
        this.#setAngle(angle);
    }
    set speed(speed) {
        this.#setSpeed(speed);
    }

    #setAngle(angle) {
        if (typeof angle !== 'number' || angle !== angle || angle > Math.PI || angle < (-Math.PI)) {
            console.error('Invalid value for angle given. Angle set to PI', angle);
            angle = 0;
        }

        this.#angle = angle;
    }
    #setSpeed(speed) {
        if (typeof speed !== 'number' || speed !== speed || speed < 0 ) {
            console.error('Invalid value for speed given. Speed set to 0', speed);
            speed = 0;
        }
        this.#speed = speed;
    }
    #setSpeedMax(speedMax) {
        if (typeof speedMax !== 'number' || speedMax !== speedMax || speedMax <= 0 ) {
            console.error('Invalid value for speedMax given. speedMax set to 100', speedMax);
            speedMax = 100;
        }
        this.#speedMax = speedMax;
    }
    #setAcceleration(acceleration) {
        if (typeof acceleration !== 'number' || acceleration !== acceleration || acceleration <= 0 ) {
            console.error('Invalid value for acceleration given. Aceleration set to 1', acceleration);
            acceleration = 1;
        }
        this.#acceleration = acceleration;
    }
}