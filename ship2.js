Ship.prototype.scan = function(aO, depth) {
    return aO.slice(0, depth);
}

// Mining unterteilen in resource types.
// Unterschiedliche Geräte notwending für unterschiedliche typen
// an Ressourcen je Aggregatszustand?

Ship.prototype.mine = function(resource, amount) {
    Ship.store(resource.retain(amount), resource.storageType);
}

Ship.prototype.store = function(amount, type) {
    var storage = ship.modules.storage[type];

    if (storage.freeAmount === 0)
        return console.info('Das Lager für den Typ ' + type + ' ist bereits voll. Es konnten keine weiteren Ressourcen eingelagert werden.');
    else if (storage.freeAmount > amount) {
        storage.freeAmount -= amount;
        storage.amount += amount;
    }
    else if (storage.freeAmount < amount &&
    storage.freeAmount > 0) {
        storage.amount += storage.freeAmount;
        console.info('Es konnte nur folgende Menge dieser Resource abgebaut werden, da zu wenig Platz im Raumschiff war: ' + storage.freeAmount )
        storage.freeAmount = 0;
    }
    else if (storage.freeAmount < 0)
        console.error('Error. Negative Werte sind nicht erlaubt für storage.freeAmount');

        
}