import { version } from "../package.json"

export const CFG = {
    GAME: {
        VERSION: version,
        TITLE: "Platformer",
        WIDTH: 1280,
        HEIGHT: 768
    },
    WORLD: {
        TILE_SIZE: 8,
        get WIDTH() { return Math.floor(1280 / this.TILE_SIZE) },
        get HEIGHT() { return Math.floor(768 / this.TILE_SIZE) },
        ROOM_MIN_SIZE: { x: 5, y: 3}
    },
    SCENES: {
        LOAD: "load",
        GAME: "game"
    }
}