import { CFG } from '../cfg'

export class LoadScene extends Phaser.Scene {

	private levelData: integer[][]

	constructor() {
		super({
			key: CFG.SCENES.LOAD
		})

		this.levelData = new Array(CFG.WORLD.HEIGHT).fill(0).map(() => new Array(CFG.WORLD.WIDTH).fill(0));

		console.log(CFG);
	}

	preload() {
		this.load.image('tiles', 'assets/drawtiles.png');

		let loadingBar = this.add.graphics({
			fillStyle: {
				color: 0xffffff
			}
		})

		this.load.on("progress", (percent: number) => {
			loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 60);
			console.log(percent);
		})

		this.load.on("complete", () => {
			console.log("done");
		})
	}

	create() {
		this.createDivision(0, 0, CFG.WORLD.WIDTH-1, CFG.WORLD.HEIGHT-1, this.levelData, 1);

		// @ts-ignore
		this.scene.start(CFG.SCENES.GAME, this.levelData);
	}

	private createDivision(x0: integer, y0: integer, x1: integer, y1: integer, data: integer[][], val: integer) {
		let randInt = (min: integer, max: integer) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		if (!((x1 - x0) > CFG.WORLD.ROOM_MIN_SIZE.x * 2 && (y1 - y0) > CFG.WORLD.ROOM_MIN_SIZE.y * 2)) {
			return;
		}

		do {
			var x = randInt(x0+2, x1-2);
			var boolA = (x - x0) >= CFG.WORLD.ROOM_MIN_SIZE.x;
			var boolB = (x1 - x) >= CFG.WORLD.ROOM_MIN_SIZE.x;
		} while (!(boolA && boolB));

		do {
			var y = randInt(y0+2, y1-2);
			var boolC = (y - y0) >= CFG.WORLD.ROOM_MIN_SIZE.y;
			var boolD = (y1 - y) >= CFG.WORLD.ROOM_MIN_SIZE.y;
		} while(!(boolC && boolD));

		for (let i = x0; i <= x1; i++) {
			data[y][i] = val;
		}
		
		for (let j = y0; j <= y1; j++) {
			data[j][x] = val;
		}

		console.log("Data", data);
		console.log("x", x);
		console.log("y", y);
		data[y][x] = val;

		if (boolA && boolC) {
			this.createDivision(x0, y0, x, y, data, val);
		}
		if (boolA && boolD) {
			this.createDivision(x0, y, x, y1, data, val);
		}
		if (boolB && boolC) {
			this.createDivision(x, y0, x1, y, data, val);
		}
		if (boolB && boolD) {
			this.createDivision(x, y, x1, y1, data, val);
		}
	}

	update() {

	}

}