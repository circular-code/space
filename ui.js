var userInterface = (function() {

    var ui = {};
    ui.create = function() {

        var container = document.getElementById('ui');
    
        container.appendChild(createShip());
        container.appendChild(createStorage());
    };
    
    ui.createShip = function() {
        var container = document.createElement('div');
        container.id = 'ship';


    }
    
    ui.createStorage = function() {
        var container = document.createElement('div');
        container.id = 'storage';

        

    }
    

    <div id="storage">
        <div id="resources">
            <div class="resourceWrapper">
            <div class="resourceTitle">Gas:</div>
            <div id="gas">0</div>
            </div> 
            <div class="resourceWrapper">
            <div class="resourceTitle">Crystal:</div>
            <div id="crystal">0</div>
            </div>
            <div class="resourceWrapper">
            <div class="resourceTitle">Metal:</div>
            <div id="metal">0</div>
            </div>
        </div>
    </div>

    return 
})();

