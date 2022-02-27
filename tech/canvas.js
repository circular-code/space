var canvas = document.getElementById("pocketUniverse");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener("click", e => {
    if (ui.menuVisible)
        userInterface.toggleMenu("hide");
});

canvas.addEventListener('DOMMouseScroll', userInterface.handlers.handleScroll, false);
canvas.addEventListener('mousewheel', userInterface.handlers.handleScroll, false);
// canvas.addEventListener("click", userInterface.handlers.mouseClickHandler, false);

canvas.addEventListener("contextmenu", e => {
    e.preventDefault();

    var translatedX = e.pageX + app.viewport.x;
    var tranlatedY = e.pageY + app.viewport.y;

    if (app.viewport.isInside(translatedX, tranlatedY)) {

        var all = Chunk.getClosestObjects(app.map.activeChunk);

        var astrobject;

        for (var i = 0; i < all.length; i++) {
            if (all[i].type !== 'nebula') {
                if (all[i].checkCollision(1, translatedX, tranlatedY)) {
                    astrobject = all[i];
                    break;
                }
            }
        }

        if (astrobject) {
            app.map.contextMenuAstrobject = astrobject;
            userInterface.manageContextMenuOptions(astrobject);
            userInterface.setPosition(e.pageY, e.pageX);
        }
        else {
            userInterface.toggleMenu("hide");
            app.map.contextMenuAstrobject = undefined;
        }
    }

    return false;
});