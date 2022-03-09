'use strict';
class Module {

    #moduleType;

    #validModuleTypes = {
        "StorageModule": true,
        "EngineModule": true,
    }

    constructor (moduleType) {
        this.#setModuleType(moduleType);
    }

    get moduleType() {
        return this.#moduleType;
    }

    #setModuleType(moduleType) {
        if (typeof moduleType !== 'string' || !this.#validModuleTypes[moduleType])
            throw new Error("Invalid moduleType given.");

        this.#moduleType = moduleType;
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
    
    constructor(dataObject, type, amount, capacity, temperatureMin, temperatureMax, temperatureCurrent, content) {

        // enable just throwing old object at constructor to create new object
        if (dataObject) {
            type = dataObject.type;
            amount = dataObject.amount;
            capacity = dataObject.capacity;
            temperatureMin = dataObject.temperatureMin;
            temperatureMax = dataObject.temperatureMax;
            temperatureCurrent = dataObject.temperatureCurrent;
            content = dataObject.temperatureCurrent;
        }

        if (typeof type === 'undefined' ||
            typeof capacity === 'undefined' ||
            typeof temperatureMin === 'undefined' ||
            typeof temperatureMax === 'undefined')
            throw new Error("Missing StorageModule constructor parameters.");

        super("StorageModule");

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
        container.classList = 'storagemodule-container storagemodule-' + this.type + ' ';

        container.innerHTML = `<div class="storagemodule-container storagemodule-${this.type}">
            <div class="storage-type">
                <p>${this.type}</p>
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
    #active;

    constructor(dataObject, type, energySource, angle, speed, speedMax, acceleration, active) {

        // enable just throwing old object at constructor to create new object
        if (dataObject) {
            type = type;
            energySource = energySource;
            angle = dataObject.angle;
            speed = dataObject.speed;
            speedMax = dataObject.speedMax;
            acceleration = dataObject.acceleration;
            active = dataObject.active;
        }

        super("EngineModule");

        this.#setType(type);
        this.#setEnergySource(energySource);
        this.#setAngle(angle);
        this.#setSpeed(speed);
        this.#setSpeedMax(speedMax);
        this.#setAcceleration(acceleration);
        this.#setActive(active);
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
    get active() {
        return this.#active;
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
    set active(active) {
        this.#setActive(active);
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
    #setActive(active) {
        this.#active = !!active;
    }

    createSlot() {
        var container = document.createElement('div');
        container.classList = 'enginemodule-container enginemodule-' + this.type;

        container.innerHTML = `<div class="enginemodule-container enginemodule-${this.type}">
            <div class="engine-type">
                <p><span>${this.type}</span></p>
                <img src="icons/${this.type}.svg" class="svg">
            </div>
            <div class="engine-content">
                <p>${this.content || ''}</p>
            </div>
        </div>`;
        return container;
    }
}

class Slot {

    #type;
    #module;
    #depth;
    #width;
    #builtin;

    #validTypes = {
        "StorageModule": true,
        "EngineModule": true,
        "ArmsModule": true,
        "ShieldsModule": true,
    }

    constructor (type, builtin, depth, width, module) {
        this.#setType(type);
        this.#setBuiltin(builtin);
        this.#setDepth(depth);
        this.#setWidth(width);

        if (module) {
            this.#setModule(module);
        }
    }

    get type() {
        return this.#type;
    }
    get builtin() {
        return this.#builtin;
    }
    get module() {
        return this.#module;
    }
    get depth() {
        return this.#depth;
    }
    get width() {
        return this.#width;
    }

    set module(module) {
        this.#setModule(module);
    }

    #setType(type) {
        if (typeof type !== 'string' || !this.#validTypes[type])
            throw new Error("Invalid type given.");

            this.#type = type;
    }
    #setBuiltin(builtin) {
        if (typeof builtin !== 'boolean') {
            console.error('Invalid value for builtin given. builtin set to true', builtin);
            builtin = true;
        }
        this.#builtin = builtin;
    }
    #setModule(module) {
        if (!module ||
            typeof module !== 'object' ||
            !module.constructor ||
            !module.constructor.name ||
            typeof module.constructor.name !== 'string' ||
            !this.#validTypes[module.constructor.name] ||
            module.constructor.name !== this.type)
            throw new Error("Invalid module given.");

        this.#module = module;
    }
    #setDepth(depth) {
        if (typeof depth !== 'number' || depth !== depth || depth < 1) {
            console.error('Invalid value for depth given. depth set to 1', depth);
            depth = 1;
        }
        this.#depth = depth;
    }
    #setWidth(width) {
        if (typeof width !== 'number' || width !== width || width < 1) {
            console.error('Invalid value for width given. width set to 1', width);
            width = 1;
        }
        this.#width = width;
    }
}