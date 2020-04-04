import { CFG } from '../cfg'
import { Level } from '../level'

export class LoadScene extends Phaser.Scene {

    private levelData:integer[][]

    constructor() {
        super({
            key: CFG.SCENES.LOAD
        })

        this.levelData = new Array(CFG.WORLD.HEIGHT).fill(0).map(() => new Array(CFG.WORLD.WIDTH).fill(0));

    }

    preload() {
        this.load.image('tiles', 'assets/drawtiles.png');

        let loadingBar = this.add.graphics({
            fillStyle: {
                color:0xffffff
            }
        })

        this.load.on("progress", (percent:number) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 60);
            console.log(percent);
        })

        this.load.on("complete", () => {
            console.log("done");
        })
    }

    create() {

        let randInt = (max:integer) => {
            return Math.floor(Math.random() * (max - 1))
        }

        let x = randInt(CFG.WORLD.WIDTH);
        let y = randInt(CFG.WORLD.HEIGHT);

        // fill row with 1
        this.levelData[y].fill(1);

        //fill column with 1
        for (let j = 0; j < this.levelData.length; j++) {
            this.levelData[j][x] = 1;
        }

        // @ts-ignore
        this.scene.start(CFG.SCENES.GAME, this.level.data);
    }

    update() {

    }

}