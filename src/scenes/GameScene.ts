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

        map.setCollision([CFG.TILE.BLOCK, CFG.TILE.B]);

        let tile = map.findByIndex(CFG.TILE.EMPTY);

        this.player = this.physics.add.sprite(tile.x * tileSize, tile.y * tileSize, 'player');
        this.player.setOrigin(0).setScale(0.6, 0.8);

        this.physics.add.collider(this.player, layer);

        // this.cameras.main.startFollow(this.player, true, 0.9, 0.9);

        // this.cameras.main.setZoom(10);
    }

    update() {
        // Horizontal movement
        this.player.setVelocityX(0);

        if (this.cursors.left?.isDown) {
            this.player.setVelocityX(-50);
        }
        else if (this.cursors.right?.isDown) {
            this.player.setVelocityX(50);
        }

        // vertical movement
        if (this.cursors.up?.isDown)
        {
            this.player.setVelocityY(-100);
        }
    }
}