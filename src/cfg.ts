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
        RTB: 12,
        LRB: 13,
        LRT: 14,
        LTB: 15,
        LT: 9,
        LB: 8,
        RT: 7,
        RB: 6,
        LR: 10,
        TB: 11,
        L: 3,
        R: 2,
        T: 4,
        B: 5
    },

    randInt (min: integer, max: integer) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}