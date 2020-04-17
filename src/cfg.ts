export const CFG = {
    GAME: {
        VERSION: "0.0.1",
        TITLE: "Platformer",
        WIDTH: 1280,
        HEIGHT: 768
    },
    WORLD: {
        TILE_SIZE: 8,
        get WIDTH() { return Math.floor(1280 / this.TILE_SIZE) },
        get HEIGHT() { return Math.floor(768 / this.TILE_SIZE) },
        ROOM_MIN_SIZE: { x: 5, y: 3},
        ROOM_OFFSET: 2
    },
    SCENES: {
        LOAD: "load",
        GAME: "game"
    },

    TILE: {
        EMPTY: 0,
        BLOCK: 1,
        LRTB: 7,
        RTB: 7,
        LRB: 7,
        LRT: 7,
        LTB: 7,
        LT: 7,
        LB: 7,
        RT: 7,
        RB: 7,
        LR: 7,
        TB: 7,
        L: 7,
        R: 7,
        T: 7,
        B: 7
    },

    randInt (min: integer, max: integer) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}