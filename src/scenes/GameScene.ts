import { CFG } from '../cfg'

export class GameScene extends Phaser.Scene {

    private character!: Phaser.GameObjects.Rectangle;
    private levelData!: integer[][];

    constructor() {
        super({
            key: CFG.SCENES.GAME
        })
    }

    init(data:integer[][]) {
        this.levelData = data;
    }

    create() {
        let grid = this.add.grid(0, 0, CFG.GAME.WIDTH, CFG.GAME.HEIGHT, 32, 32, 0, 0, 0xffffff, 0.25).setOrigin(0);
        this.character = this.add.rectangle(0, 0, 32, 32, 0xff0000).setOrigin(0);

        let map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, data: this.levelData});
        let tiles = map.addTilesetImage('tiles');
        map.createStaticLayer(0, tiles, 0, 0);
        
    }

    update() {

    }
}