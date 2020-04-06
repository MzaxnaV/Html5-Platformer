import { CFG } from '../cfg'

export class GameScene extends Phaser.Scene {

    private character!: Phaser.GameObjects.Rectangle;
    private levelData!: integer[][];

    constructor() {
        super({
            key: CFG.SCENES.GAME
        })
    }

    init(data: integer[][]) {
        this.levelData = data;
    }

    create() {
        let tileSize = CFG.WORLD.TILE_SIZE;
        let grid = this.add.grid(0, 0, CFG.GAME.WIDTH, CFG.GAME.HEIGHT, tileSize, tileSize, 0, 0, 0xffffff, 0.25).setOrigin(0)


        let map = this.make.tilemap({ tileWidth: tileSize, tileHeight: tileSize, data: this.levelData });
        let tiles = map.addTilesetImage('tiles');
        map.createStaticLayer(0, tiles, 0, 0);

        this.character = this.add.rectangle(8, 8, tileSize, tileSize, 0xff0000).setOrigin(0);
    }

    update() {

    }
}