import { CFG } from '../cfg'

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CFG.SCENES.LOAD
        })
    }

    preload() {
        //TODO: load data here :)
    }

    create() {
        this.scene.start(CFG.SCENES.GAME);
    }
}