'use strict';

function Commodity (loaded, name, amount, price, unit) {

    if (loaded)
        return this;

    if (!unit)
        unit = 'T';

    if (!price)
		price = 0;

    if (!amount)
        amount = 0;

    if (!name)
        name = 'Unknown';

    this.name = name;
    this.amount = amount;
    this.price = price;
    this.unit = unit;
}
