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
  // if we press the ESC
  if (e.key == "Escape" && document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove("is-visible");
  }
});

function createModalPanel(id, subtitle, height) {
    var panel = document.createElement('div');
    panel.className = 'modal-panel';
    panel.id = id;

    if (height)
        panel.style.height = height + 'px';

    var title = document.createElement('h3');
    title.className = 'modal-subtitle';
    title.textContent = subtitle;

    var sub = document.createElement('div');
    sub.className = 'modal-subcontent-container';

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

function createModalResource(title, buy, sell, buttontext) {

    var sub = document.createElement('div');
    sub.className = 'modal-resource-container modal-subcontent';

    var h4 = document.createElement('h4');
    h4.className = 'modal-resource-name';
    h4.textContent = title;

    var input = document.createElement('input');
    input.type = 'number';
    input.name = title;

    var button = document.createElement('button');
    button.type = 'button';
    button.textContent = buy ? 'buy' : sell ? 'sell' : buttontext;

    sub.appendChild(h4);
    sub.appendChild(input);
    sub.appendChild(button);

    return sub;
}

function createTradePostModal() {
    var infoPanel = createModalPanel('tradepost-info', 'General Information', 300);
    infoPanel.sub.appendChild(createModalInfo('Name','Iowa Outpost'));
    infoPanel.sub.appendChild(createModalInfo('System','Dalarian 113.14'));
    infoPanel.sub.appendChild(createModalInfo('Status','peaceful'));
    infoPanel.sub.appendChild(createModalInfo('Allegiance','High Order'));
    infoPanel.sub.appendChild(createModalInfo('Commander','Rasmus Skarsgard'));

    var fuelPanel = createModalPanel('tradepost-fuel', 'Maintenance', 278);
    fuelPanel.sub.appendChild(createModalResource('Fuel', true));
    fuelPanel.sub.appendChild(createModalResource('Jump Fuel', true));
    fuelPanel.sub.appendChild(createModalResource('Energy', true));
    fuelPanel.sub.appendChild(createModalResource('Repair Service', true));

    var buyPanel = createModalPanel('tradepost-buy', 'Buy');

    var resources = [];

    for (var index = 0; index < 12; index++) {
        var element = elements[randomNumBetween(elements.length)]
        if (resources.indexOf(element) === -1) {
            resources.push(element);
            buyPanel.sub.appendChild(createModalResource(element, true));
        }
        else
            index--;
    }

    var sellPanel = createModalPanel('tradepost-sell', 'Sell');

    var resources = [];

    for (var index = 0; index < 12; index++) {
        var element = elements[randomNumBetween(elements.length)]
        if (resources.indexOf(element) === -1) {
            resources.push(element);
            sellPanel.sub.appendChild(createModalResource(element, false, true));
        }
        else
            index--;
    }

    var target = document.getElementById('modalContent');
    target.appendChild(infoPanel.panel);
    target.appendChild(fuelPanel.panel);
    target.appendChild(buyPanel.panel);
    target.appendChild(sellPanel.panel);
}