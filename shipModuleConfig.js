export default shipUserConfig = {
    "engines":
    {
        "blaengine":
        {
            "level": 1,
            "info": {
                "name": "blaengine"
            },
            "stats": {
                "speed": 0,
                "speedMax": 350,
                "speedMin": 0,
                "acceleration": 1
            },
            "type": ["fixed"]
        }
    },
    "storages":
    {
        "type": [ "fixed", "optional" ]
    },
    "batteries":
    {
        "type": ["optional"]
    },
    "weapons":
    {
        "railgun":
        {
            "level": 1,
            "info": {
                "name": "railgun",
                "ammo":
            },
            "stats": {
                "projectileSpeed": 0,
                "frequency": 350,
                "damage": 100,
                "damagetype": "shield"
            },
            "type": ["fixed"]
        }
    },

}