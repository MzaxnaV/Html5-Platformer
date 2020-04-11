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

    randInt (min: integer, max: integer) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}