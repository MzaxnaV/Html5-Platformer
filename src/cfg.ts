import { version } from "../package.json"

export const CFG = {
    GAME: {
        VERSION: version,
        TITLE: "Platformer",
        WIDTH: 1280,
        HEIGHT: 768
    },
    WORLD: {
        WIDTH: Math.floor(1280/32),
        HEIGHT: Math.floor(768/32)
    },
    SCENES: {
        LOAD: "load",
        GAME: "game"
    }
}