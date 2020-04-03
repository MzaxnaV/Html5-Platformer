import { version } from "../package.json"

export const CFG = {
    GAME: {
        VERSION: version,
        TITLE: "Platformer",
        WIDTH: 1280,
        HEIGHT: 768
    },
    SCENES: {
        LOAD: "load",
        GAME: "game"
    }
}