import { CFG } from '../cfg'

export class GameScene extends Phaser.Scene {

    private levelData!: integer[][];
    private player!: Phaser.Physics.Arcade.Sprite;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({
            key: CFG.SCENES.GAME
        })

        
    }

    init(data: integer[][]) {
        this.levelData = data;
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        let tileSize = CFG.WORLD.TILE_SIZE;
        // let grid = this.add.grid(0, 0, CFG.WORLD.WIDTH* tileSize, CFG.WORLD.HEIGHT*tileSize, tileSize, tileSize, 0, 0, 0xffffff, 0.25).setOrigin(0)

        let map = this.make.tilemap({ tileWidth: tileSize, tileHeight: tileSize, data: this.levelData });
        let tiles = map.addTilesetImage('tiles');
        let layer = map.createStaticLayer(0, tiles, 0, 0);

        map.setCollision(1);

        let tile = map.findByIndex(0);
        console.log(tile);
        this.player = this.physics.add.sprite(tile.x * tileSize, tile.y * tileSize, 'player');
        this.player.setOrigin(0).setScale(0.8, 0.8);
        console.log('player', this.player);
        this.physics.add.collider(this.player, layer);

        
    }

    update() {
    // Horizontal movement
        this.player.setVelocityX(0);

        if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-100);
        }
        else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(100);
        }
        if (this.cursors.up?.isDown)
        {
            this.player.setVelocityY(-100);
        }
    }
}