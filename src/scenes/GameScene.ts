import { CFG } from '../cfg'

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: CFG.SCENES.GAME
        })
    }

    create() {
        var grid = this.add.grid(CFG.GAME.WIDTH/2, CFG.GAME.HEIGHT/2, CFG.GAME.WIDTH, CFG.GAME.HEIGHT, 64, 64, 0, 0, 0xffffff, 0.25)
    }
}