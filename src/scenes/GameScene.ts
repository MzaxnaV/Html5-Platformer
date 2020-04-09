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
        // let grid = this.add.grid(0, 0, CFG.WORLD.WIDTH* tileSize, CFG.WORLD.HEIGHT*tileSize, tileSize, tileSize, 0, 0, 0xffffff, 0.25).setOrigin(0)

        let map = this.make.tilemap({ tileWidth: tileSize, tileHeight: tileSize, data: this.levelData });
        let tiles = map.addTilesetImage('tiles');
        map.createStaticLayer(0, tiles, 0, 0);

        let y = 1;
        for (let j = 0; j < this.levelData.length; j++) {
            if(this.levelData[j][1] == 1){
                y = j-1;
                break;
            }  
        }

        this.character = this.add.rectangle(8, y*8, tileSize, tileSize, 0xff0000).setOrigin(0);
    }

    update() {

    }
}