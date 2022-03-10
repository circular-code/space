'use strict';

class Commodity {
    constructor(dataObject, name, amount, type, price, unit) {
        if (dataObject) {
            name = dataObject.name;
            amount = dataObject.amount;
            type = dataObject.type;
            price = dataObject.price;
            unit = dataObject.unit;
        }

        if (!price)
            price = 0;
        
        if (!amount)
            amount = 0;

        if (!unit)
            if (amount === 1)
                unit = '';
            else 
                unit = 't';
        
        if (!name)
            name = 'Unknown';

        this.name = name;
        this.amount = amount;
        this.type = type;
        this.price = price;
        this.unit = unit;
    }
}