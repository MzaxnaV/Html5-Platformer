import { CFG } from '../cfg'

class Room {
	public size = { w: CFG.WORLD.ROOM_MIN_SIZE.x, h: CFG.WORLD.ROOM_MIN_SIZE.y };
	public pos = { x: CFG.WORLD.ROOM_OFFSET, y: CFG.WORLD.ROOM_OFFSET };

	constructor(w: integer, h: integer) { // remove this
		this.size.w = CFG.randInt(this.size.w, w - 2 * CFG.WORLD.ROOM_OFFSET);
		this.size.h = CFG.randInt(this.size.h, h - 2 * CFG.WORLD.ROOM_OFFSET);
		this.pos.x = CFG.randInt(this.pos.x, w - 2 * CFG.WORLD.ROOM_OFFSET - this.size.w);
		this.pos.y = CFG.randInt(this.pos.y, h - 2 * CFG.WORLD.ROOM_OFFSET - this.size.h);
	}
}

export class LoadScene extends Phaser.Scene {

	private levelData: integer[][]
	private level: Room[][]

	constructor() {
		super({
			key: CFG.SCENES.LOAD
		})

		this.levelData = new Array(CFG.WORLD.HEIGHT).fill(0).map(() => new Array(CFG.WORLD.WIDTH).fill(0));
		this.level = this.createLevel();
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
		// this.createDivision(0, 0, CFG.WORLD.WIDTH - 1, CFG.WORLD.HEIGHT - 1, this.levelData, 1);
		this.generateLevelData();
		console.log(this.level);
		// @ts-ignore
		this.scene.start(CFG.SCENES.GAME, this.levelData);
	}

	private createLevel() {

		// define sublevel,
		let sublevel = {
			size: { x: 16, y : 16 }, //remove from here
			get w() { return Math.floor(CFG.WORLD.HEIGHT / this.size.x); },
			get h() { return Math.floor(CFG.WORLD.WIDTH / this.size.y); },
		}

		let level = new Array<Room>(sublevel.w).fill(new Room(sublevel.size.x, sublevel.size.y)).map(() => new Array<Room>(sublevel.h).fill(new Room(sublevel.size.x, sublevel.size.y)));

		return level;
	}

	private generateLevelData() {

		for (let j = 0; j < this.level.length; j++) {
			for (let i = 0; i < this.level[j].length; i++) {
				let indices = this.makeRect(this.level[j][i]);
				indices.forEach( (indice: [number, number]) => {
					this.levelData[indice[0] + 16 * j][indice[1] + 16 * i] = 1;
				})
			}
		}
	}

	private makeRect(room: Room) {
		let wallIndices: [number, number][] = [];

			for (let i = 0; i <= room.size.w; i++) {
				wallIndices.push([room.pos.x + i, room.pos.y]);
				wallIndices.push([room.pos.x + i, room.size.h + room.pos.y]);
			}

			for (let j = 0; j <= room.size.h; j++) {
				wallIndices.push([room.pos.x, room.pos.y + j]);
				wallIndices.push([room.pos.x + room.size.w, room.pos.y + j]);
			}

			return wallIndices;
	}

	private createDivision(x0: integer, y0: integer, x1: integer, y1: integer, levelData: integer[][], val: integer) {

		// TODO: remove this from here
		let randInt = (min: integer, max: integer) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// check if there is space to subdivide rooms
		if (!((x1 - x0) > 2 + CFG.WORLD.ROOM_MIN_SIZE.x * 2 && (y1 - y0) > 2 + CFG.WORLD.ROOM_MIN_SIZE.y * 2)) {
			return;
		}

		do {
			var x = randInt(x0 + 2, x1 - 2);
			var right = (x - x0) > CFG.WORLD.ROOM_MIN_SIZE.x;
			var left = (x1 - x) > CFG.WORLD.ROOM_MIN_SIZE.x;
		} while (!(right && left));

		do {
			var y = randInt(y0 + 2, y1 - 2);
			var top = (y - y0) > CFG.WORLD.ROOM_MIN_SIZE.y;
			var bottom = (y1 - y) > CFG.WORLD.ROOM_MIN_SIZE.y;
		} while (!(top && bottom));

		// divide vertically
		for (let i = x0; i <= x1; i++) {
			levelData[y][i] = val;
		}

		// divide horizontally
		for (let j = y0; j <= y1; j++) {
			levelData[j][x] = val;
		}

		console.log("Data", levelData);
		console.log("x", x);
		console.log("y", y);

		if (top && right) {
			this.createDivision(x0, y0, x, y, levelData, val);
		}
		if (bottom && right) {
			this.createDivision(x0, y, x, y1, levelData, val);
		}
		if (top && left) {
			this.createDivision(x, y0, x1, y, levelData, val);
		}
		if (bottom && left) {
			this.createDivision(x, y, x1, y1, levelData, val);
		}
	}

	update() {

	}

}