'use strict';
class Module {

    #moduleType;
    #builtin;

    #validModuleTypes = {
        "scanner": true,
        "storage": true,
        "engine": true,
    }

    constructor (moduleType, builtin) {
        this.#setModuleType(moduleType);
        this.#setBuiltin(builtin);
    }

    get moduleType() {
        return this.#moduleType;
    }
    get builtin() {
        return this.#builtin;
    }

    #setModuleType(moduleType) {
        if (typeof moduleType !== 'string' || !this.#validModuleTypes[moduleType])
            throw new Error("Invalid moduleType given.");

        this.#moduleType = moduleType;
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

    #type;
    #amount;
    #capacity;
    #temperatureMin;
    #temperatureMax;
    #temperatureCurrent;
    #content;

    #validStorageTypes = {
        "solid": true,
        "liquid": true,
        "gas": true,
        "plasma": true,
        "energy": true
    }
    #validContentTypes = {
        "stone": true,
        "energy": true,
        "fuel": true,
    };
    
    constructor(dataObject, builtin, type, amount, capacity, temperatureMin, temperatureMax, temperatureCurrent, content) {

        // enable just throwing old object at constructor to create new object
        if (dataObject) {
            builtin = dataObject.builtin;
            type = dataObject.type;
            amount = dataObject.amount;
            capacity = dataObject.capacity;
            temperatureMin = dataObject.temperatureMin;
            temperatureMax = dataObject.temperatureMax;
            temperatureCurrent = dataObject.temperatureCurrent;
            content = dataObject.temperatureCurrent;
        }

        if (typeof builtin === 'undefined' ||
            typeof type === 'undefined' ||
            typeof capacity === 'undefined' ||
            typeof temperatureMin === 'undefined' ||
            typeof temperatureMax === 'undefined')
            throw new Error("Missing StorageModule constructor parameters.");

        super("storage", builtin);

        this.#setType(type);
        this.#setCapacity(capacity);
        this.#setTemperatureMin(temperatureMin);
        this.#setTemperatureMax(temperatureMax);

        if (typeof amount !== 'undefined')
            this.#setAmount(amount);
        
        if (typeof temperatureCurrent !== 'undefined')
            this.#setTemperatureCurrent(temperatureCurrent);

        if(typeof content !== 'undefined')
            this.#setContent(content);
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
    get temperatureMin() {
        return this.#temperatureMin;
    }
    get temperatureMax() {
        return this.#temperatureMax;
    }
    get temperatureCurrent() {
        return this.#temperatureCurrent;
    }
    get content() {
        return this.#content;
    }

    set amount(amount) {
        this.#setAmount(amount);
    }
    set temperatureCurrent(temperatureCurrent) {
        this.#setTemperatureCurrent(temperatureCurrent);
    }
    set content(content) {
        this.#setContent(content);
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
    #setTemperatureMin(temperatureMin) {
        if (typeof temperatureMin !== 'number' || temperatureMin !== temperatureMin || temperatureMin < -273.15) {
            console.error('Invalid value for temperatureMin given. temperatureMin set to 0', temperatureMin);
            temperatureMin = 0;
        }
        this.#temperatureMin = temperatureMin;
    }
    #setTemperatureMax(temperatureMax) {
        if (typeof temperatureMax !== 'number' || temperatureMax !== temperatureMax || temperatureMax < -273.15) {
            console.error('Invalid value for temperatureMax given. temperatureMax set to 0', temperatureMax);
            temperatureMax = 0;
        }
        this.#temperatureMax = temperatureMax;
    }
    #setTemperatureCurrent(temperatureCurrent) {
        if (typeof temperatureCurrent !== 'number' || temperatureCurrent !== temperatureCurrent || temperatureCurrent < this.#temperatureMin || temperatureCurrent > this.#temperatureMax) {
            throw new Error('Invalid value for temperatureCurrent given. temperatureCurrent needs to be between ' + this.#temperatureMin + ' and ' + this.temperatureMax + '. temperatureCurrent set to ' + this.#temperatureMin);
        }
        this.#temperatureCurrent = temperatureCurrent;
    }
    #setContent(content) {
        if (typeof content !== 'string' || !this.#validContentTypes[content]) {
            throw new Error('Invalid value for content given.');
        }
        this.#content = content;
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

    createSlot() {
        var container = document.createElement('div');
        container.classList = 'storagemodule-container storagemodule-' + this.type + ' ' + this.builtin;

        container.innerHTML = `<div class="storagemodule-container storagemodule-${this.type}">
            <div class="storage-type">
                <p>${this.type + (this.builtin ? ' builtin' : '')}</p>
                <img src="icons/${this.type}.svg" class="svg">
            </div>
            <div class="storage-content">
                <p>${this.content || ''}</p>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width:${ this.amount / this.capacity * 100}%"></div>
            </div>
        </div>`;
        return container;

        // "solid": true,
        // "liquid": true,
        // "gas": true,
        // "plasma": true,
        // "energy": true
    }
}

class EngineModule extends Module {

    #validEngineTypes = {
        "jump": true,
        "energy": true,
        "fuel": true,
    };
    #angle;
    #speed;
    #speedMax;
    #acceleration;
    #type;
    #energySource;

    constructor(dataObject, builtin, type, energySource, angle, speed, speedMax, acceleration) {

        // enable just throwing old object at constructor to create new object
        if (dataObject) {
            builtin = dataObject.builtin;
            type = type;
            energySource = energySource;
            angle = dataObject.angle;
            speed = dataObject.speed;
            speedMax = dataObject.speedMax;
            acceleration = dataObject.acceleration;
        }

        super("engine", builtin);

        this.#setType(type);
        this.#setEnergySource(energySource);
        this.#setAngle(angle);
        this.#setSpeed(speed);
        this.#setSpeedMax(speedMax);
        this.#setAcceleration(acceleration);
    }

    get type() {
        return this.#type;
    }
    get energySource() {
        return this.#energySource;
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

    set energySource(energySource) {
        this.#setEnergySource(energySource);
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
    #setType(type) {
        if (typeof type !== 'string' || !this.#validEngineTypes[type]) {
            console.error('Invalid value for type given. type set to solid', type);
            type = 'solid';
        }
        this.#type = type;
    }
    #setEnergySource(energySource) {
        //TODO: check if energy source matches type
        if (typeof energySource !== 'number' || energySource !== energySource || energySource < 0 ) {
            console.error('Invalid value for energySource given. energySource set to 0', energySource);
            energySource = 0;
        }
        this.#energySource = energySource;
    }
}