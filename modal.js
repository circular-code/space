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

function createModalPanel(id, subtitle, height) {
    var panel = document.createElement('div');
    panel.className = 'modal-panel';
	panel.id = id;

	if (height) {
		panel.style.height = height + 'px';
		panel.style.maxHeight = height + 'px';
	}

    var title = document.createElement('h3');
    title.className = 'modal-subtitle';
    title.textContent = subtitle;

    var sub = document.createElement('div');
	sub.className = 'modal-subcontent-container';

	if (height) {
		sub.style.height = height - 60 + 'px';
		sub.style.maxHeight = height - 60 + 'px';
	}

    panel.appendChild(title);
    panel.appendChild(sub);

    return {panel:panel, sub: sub};
};

function createModalInfo(title, text) {

    var sub = document.createElement('div');
    sub.className = 'modal-subcontent';

    var h4 = document.createElement('h4');
    h4.textContent = title;

    var p = document.createElement('p');
    p.className = 'modal-text';
    p.textContent = text;

    sub.appendChild(h4);
    sub.appendChild(p);

    return sub;
}

function createModalCommodity(commodity, buy, buttontext) {

    var sub = document.createElement('div');
    sub.className = 'modal-commodity-container modal-subcontent';

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
	price.textContent = commodity.price + ' $/' + commodity.unit;

	sub.appendChild(h4);
	sub.appendChild(amount);
	sub.appendChild(inputContainer);
    sub.appendChild(button);
	sub.appendChild(price);

    return sub;
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

function clearTradePostModal() {
  	document.getElementById('modalContent').innerHTML = '';
}

function createTradePostModal(post) {

    clearTradePostModal();

    document.getElementById('modalTitle').textContent = post.info.title + ' - ' + post.info.system + ' - ' + post.info.allegiance;

    var infoPanel = createModalPanel('tradepost-info', 'General Information', 295);
    infoPanel.sub.appendChild(createModalInfo('Name', post.info.title));
    infoPanel.sub.appendChild(createModalInfo('System', post.info.system));
    infoPanel.sub.appendChild(createModalInfo('Status', post.info.status));
    infoPanel.sub.appendChild(createModalInfo('Allegiance', post.info.allegiance));
    infoPanel.sub.appendChild(createModalInfo('Commander', post.info.commander));

	var fuelPanel = createModalPanel('tradepost-fuel', 'Maintenance', 283);
	for (var index = 0; index < post.maintenance.length; index++)
		fuelPanel.sub.appendChild(createModalCommodity(post.maintenance[index], true));

    var buyPanel = createModalPanel('tradepost-buy', 'Buy');

    for (var index = 0; index < post.haveResources.length; index++)
      buyPanel.sub.appendChild(createModalCommodity(post.haveResources[index], true));

    var sellPanel = createModalPanel('tradepost-sell', 'Sell');

    for (var index = 0; index < post.needResources.length; index++)
      	sellPanel.sub.appendChild(createModalCommodity(post.needResources[index], false));

    var target = document.getElementById('modalContent');
    target.appendChild(infoPanel.panel);
    target.appendChild(fuelPanel.panel);
    target.appendChild(buyPanel.panel);
    target.appendChild(sellPanel.panel);
}