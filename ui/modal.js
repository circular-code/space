const closeEls = document.querySelectorAll("[data-close]");

for (const el of closeEls) {
  el.addEventListener("click", function() {
    this.parentElement.parentElement.parentElement.classList.remove("is-visible");
  });
}

document.addEventListener("click", e => {
  if (e.target == document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove("is-visible");
  }
});

document.addEventListener("keyup", e => {
  if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove("is-visible");
  }
});

function createModalPanel(id, panelTitle, height) {
    var panel = document.createElement('div');
    panel.className = 'modal-panel';
	panel.id = id;

	if (height) {
		panel.style.height = height + 'px';
		panel.style.maxHeight = height + 'px';
	}

    var title = document.createElement('h3');
    title.className = 'modal-panel-head';
    title.textContent = panelTitle;

    var content = document.createElement('div');
	content.className = 'modal-panel-body';

	if (height) {
		content.style.height = height - 60 + 'px';
		content.style.maxHeight = height - 60 + 'px';
	}

    panel.appendChild(title);
    panel.appendChild(content);

    return {panel:panel, content: content, title: title};
};

function createModalInfo(title, text) {

    var content = document.createElement('div');
    content.className = 'modal-panel-content';

    var h4 = document.createElement('h4');
    h4.textContent = title;

    var p = document.createElement('p');
    p.className = 'modal-text';
    p.textContent = text;

    content.appendChild(h4);
    content.appendChild(p);

    return content;
}

function createModalCommodity(commodity, buy, buttontext) {

    var content = document.createElement('div');
    content.className = 'modal-commodity-container modal-panel-content';

    var h4 = document.createElement('h4');
    h4.className = 'modal-commodity-name';
	h4.textContent = commodity.name;

	var amount = document.createElement('p');
	amount.className = 'modal-commodity-amount';
	amount.textContent = commodity.amount === -1 ? '' : '(' + commodity.amount + ' ' + commodity.unit + ')';

	var inputContainer = document.createElement('div');
	inputContainer.className = 'modal-commodity-input-container';

	var valueInfo = document.createElement('p');
	valueInfo.className = 'modal-commodity-value-info';

    var input = document.createElement('input');
    input.type = 'number';
	input.name = commodity.name;
	input.addEventListener('keyup', function(e) {
		if (e.keyCode !== 13)
			valueInfo.textContent = e.target.value > 0 ? e.target.value * commodity.price + '$' : '';
		else
			changeValue(commodity, buy, amount, input);
	});

	inputContainer.appendChild(valueInfo);
	inputContainer.appendChild(input);

    var button = document.createElement('button');
    button.type = 'button';
	button.textContent = buttontext || (buy ? 'buy' : 'sell');
	button.addEventListener('click', function() {
		changeValue(commodity, buy, amount, input);
	});

	var price = document.createElement('p');
	price.className = 'modal-commodity-price';
	price.textContent = commodity.price + ' $' + (commodity.amount === 1 ? '' : '/' + commodity.unit);

	content.appendChild(h4);
	content.appendChild(amount);
	content.appendChild(inputContainer);
    content.appendChild(button);
	content.appendChild(price);

    return content;
}

function changeValue (commodity, buy, amount, input) {
	var value = +input.value;
	if (value > 0) {
		if (buy) {
			if (commodity.amount === -1) {
				ship.store(new Commodity(false,commodity.name,value,commodity.type));
			}
			else if (commodity.amount < value) {
				alert('only ' + commodity.amount + ' left in stock. Please decrease amount to match stock left.');
				value = commodity.amount;
			}
			else if (commodity.amount === 0) {
				alert('We are very sorry, but it seems like we are out of stock. Please come back later');
			}
			else {
				commodity.amount -= +value;
				amount.textContent = '(' + commodity.amount + ' ' + commodity.unit + ')';
				ship.store(new Commodity(false,commodity.name,value,commodity.type));
			}
		}
		else {
			commodity.amount += +value;
			amount.textContent = '(' + commodity.amount + ' ' + commodity.unit + ')';
		}
	}
}

function clearModal() {
  	document.getElementById('modalContent').innerHTML = '';
}

function createModal(data, variant) {
	
	clearModal();
	var className = data.constructor.name.toLowerCase();
	document.getElementById('modal').className = `modal ${className}-modal`;
	var content = document.getElementById('modalContent');

	switch (className) {
		case "tradepost":
			createTradepostModal(content, data);
			break;

		case "shipyard":
			createShipyardModal(content, data);
			break;

		case "ship":
			switch (variant) {
				case "edit":
					createShipEditModal(content, data);
					break;

				default:
					createShipDetailsModal(content, data);
					break;
			}
			break;
	};

	document.getElementById("modal").classList.add("is-visible");
}

function createTradepostModal(modal, post) {

    document.getElementById('modalTitle').textContent = post.info.title + ' - ' + post.info.system + ' - ' + post.info.allegiance;

    var infoPanel = createModalPanel('Tradepost-info', 'General Information', 295);
    infoPanel.content.appendChild(createModalInfo('Name', post.info.title));
    infoPanel.content.appendChild(createModalInfo('System', post.info.system));
    infoPanel.content.appendChild(createModalInfo('Status', post.info.status));
    infoPanel.content.appendChild(createModalInfo('Allegiance', post.info.allegiance));
    infoPanel.content.appendChild(createModalInfo('Commander', post.info.commander));

	var fuelPanel = createModalPanel('Tradepost-fuel', 'Maintenance', 283);
	for (var index = 0; index < post.maintenance.length; index++)
		fuelPanel.content.appendChild(createModalCommodity(post.maintenance[index], true));

    var buyPanel = createModalPanel('Tradepost-buy', 'Buy');

    for (var index = 0; index < post.haveResources.length; index++)
      buyPanel.content.appendChild(createModalCommodity(post.haveResources[index], true));

    var sellPanel = createModalPanel('Tradepost-sell', 'Sell');

    for (var index = 0; index < post.needResources.length; index++)
      	sellPanel.content.appendChild(createModalCommodity(post.needResources[index], false));

    modal.appendChild(infoPanel.panel);
    modal.appendChild(fuelPanel.panel);
    modal.appendChild(buyPanel.panel);
    modal.appendChild(sellPanel.panel);
}

function createShipyardModal(modal, yard) {

	document.getElementById('modalTitle').textContent = yard.name;

    var infoPanel = createModalPanel('Shipyard-info', 'Shipyard Information', 295);

	var fuelPanel = createModalPanel('Shipyard-fuel', 'Maintenance', 283);
	for (var index = 0; index < yard.maintenance.length; index++)
		fuelPanel.content.appendChild(createModalCommodity(yard.maintenance[index], true));

	var availableShipsPanel = createModalPanel('availableShipsPanel', 'Available Ships');
	for (index = 0; index < yard.availableShips.length; index++)
		availableShipsPanel.content.appendChild(createModalCommodity(yard.availableShips[index], true));

	var availableModulesPanel = createModalPanel('availableModulesPanel', 'Available Modules', 478);
	for (index = 0; index < yard.availableModules.length; index++)
	availableModulesPanel.content.appendChild(createModalCommodity(yard.availableModules[index], true));

	var editPanel = createModalPanel('Shipyard-ship-edit', 'Edit Ship', 100);
	var editButton = document.createElement('button');
	editButton.textContent = 'Edit ship';
	editButton.onclick = () => {createModal(app.ship, "edit")};
	editPanel.content.appendChild(editButton);

    modal.appendChild(infoPanel.panel);
	modal.appendChild(fuelPanel.panel);
	modal.appendChild(availableShipsPanel.panel);
	modal.appendChild(availableModulesPanel.panel);
	modal.appendChild(editPanel.panel);
}

function createShipDetailsModal(modal, ship) {
	clearModal();
	document.getElementById('modal').className = 'modal ship-modal'
	document.getElementById('modalTitle').textContent = `${ship.details.name}, ${ship.details.class} ${ship.details.model}${ship.details.variant}, ${ship.details.manufacturer}`

    var infoPanel = createModalPanel('Ship-details-info', 'Basic Ship Information');
	var shipSlotsContainer = createModalPanel('Ship-details-info', 'Basic Ship Information');

	var shipSlotsContainer = document.createElement('div');
	shipSlotsContainer.id = 'slotContainer';
	shipSlotsContainer.classList = 'modal-panel';

	createShipSlots(shipSlotsContainer, ship);

    modal.appendChild(infoPanel.panel);
	modal.appendChild(shipSlotsContainer);
}

function createShipEditModal(modal, ship) {
	clearModal();
	document.getElementById('modal').className = 'modal ship-edit-modal'
	document.getElementById('modalTitle').textContent = `${ship.details.name}, ${ship.details.class} ${ship.details.model}${ship.details.variant}, ${ship.details.manufacturer}`

    var infoPanel = createModalPanel('Ship-edit-info', 'Basic Ship Information');

	var shipSlotsContainer = document.createElement('div');
	shipSlotsContainer.id = 'slotContainer';
	shipSlotsContainer.classList = 'modal-panel';

	createShipSlots(shipSlotsContainer, ship);

	// TODO: only replace slots/modules in Shipyard
	// TODO: mostly view, little edit current modules in ship (e.g. change active engine, toggle shields on/off, choose main battery?)

	var availableModulesContainer = document.createElement('div');
	availableModulesContainer.id = 'availableModulesContainer';
	availableModulesContainer.classList = 'modal-panel';

	// createShipSlots(availableModulesContainer, ship);

    modal.appendChild(infoPanel.panel);
	modal.appendChild(shipSlotsContainer);
	modal.appendChild(availableModulesContainer);
}

function createShipSlots(container, ship) {
	for (let i = 0; i < ship.slots.length; i++) {

		let module = ship.slots[i].module;
		let slotContainer = document.createElement('div');
		slotContainer.classList = 'slot';

		if (module && module.constructor && module.createSlot) {
			slotContainer.appendChild(module.createSlot());
			slotContainer.classList.add('slot-' + module.constructor.name.toLowerCase());

			switch(module.constructor.name) {
				case 'EngineModule':
					if (module.active)
						slotContainer.classList.add('active');

					if (module.type !== 'jump')
						slotContainer.addEventListener('click', function() {
							ship.slots.forEach(slot => {
								if (slot.module instanceof EngineModule)
									slot.module.active = false;
							});
							document.querySelector('.slot-enginemodule.active').classList.remove('active');
							slotContainer.classList.add('active');
							module.active = true;
							ship.activeEngine = module;
						});
					break;
				
				case 'StorageModule':
					if (module.amount > 0)
						slotContainer.classList.add('active');
					break;
			}
		}
		else {
			let storageContainer = document.createElement('div');
			storageContainer.classList = 'storagemodule-container storagemodule-empty';
			storageContainer.innerHTML = 'empty';
			slotContainer.appendChild(storageContainer);
		}

        container.appendChild(slotContainer)
	}
}