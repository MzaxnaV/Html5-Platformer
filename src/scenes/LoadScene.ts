import { CFG } from '../cfg'

export class LoadScene extends Phaser.Scene {

    private level: number[][];

    constructor() {
        super({
            key: CFG.SCENES.LOAD
        })

        this.level = new Array(CFG.WORLD.HEIGHT).fill(0).map(() => new Array(CFG.WORLD.WIDTH).fill(0));

    }

    preload() {
        //TODO: load data here :)
    }

    create() {

        let randInt = (max:integer) => {
            return Math.floor(Math.random() * (max - 1))
        }

        let x = randInt(CFG.WORLD.WIDTH);
        let y = randInt(CFG.WORLD.HEIGHT);

        // choose a random row and random colunn
        this.level[y].fill(1);

        for (let j = 0; j < CFG.WORLD.HEIGHT; j++) {
            this.level[j][x] = 1;
        }

        // @ts-ignore
        this.scene.start(CFG.SCENES.GAME, this.level);
    }

    update() {

    }

}