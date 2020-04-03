import { CFG } from '../cfg'

export class GameScene extends Phaser.Scene {

    private character!: Phaser.GameObjects.Rectangle;
    private levelData!: number[][];

    constructor() {
        super({
            key: CFG.SCENES.GAME
        })
    }

    init(data: number[][]) {
        this.levelData = data;
    }

    create() {
        var grid = this.add.grid(0, 0, CFG.GAME.WIDTH, CFG.GAME.HEIGHT, 32, 32, 0, 0, 0xffffff, 0.25).setOrigin(0);
        this.character = this.add.rectangle(0, 0, 32, 32, 0xff0000).setOrigin(0);

        for (let j = 0; j < CFG.WORLD.HEIGHT ; j++ ) {
            for (let i = 0; i < CFG.WORLD.WIDTH; i++) {
                if (this.levelData[j][i] != 0) {
                    this.add.rectangle(i * 32, j * 32, 32, 32, 0x000000).setOrigin(0)
                }
            }
        }
    }

    update() {

    }
}