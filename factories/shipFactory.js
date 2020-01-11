

function BuildShip(Info, Engine, Storage, Battery)
{
    var collided = true;
    var xcounter = 0;
    while (collided) {

        collided = checkAllCollisions(map.chunks[0], Info.x, Info.y, Info.r);

        if (collided) {
            Info.x = randomNumBetween(Info.size);
            Info.y = randomNumBetween(Info.size);
        }
        else {
            collided = false;
        }
        xcounter++;
        if (xcounter > 100) {
            console.error('Could not generate ship on map. Check map creation values.');
            collided = false;
        }
    }

    this.r = Info.r;
    this.x = Info.x;
    this.y = Info.y;
    this.level = Info.level;
    this.engine = Engine;
    this.storages =Storage;
    this.batteries = Battery;
    this.capacity = 5;

    this.storages.forEach(storage => {
        storage.createUI();
    });
}